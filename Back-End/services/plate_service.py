# Arquivo: Back-End/services/plate_service.py
#
# YOLO acha a placa na imagem e o EasyOCR lê o texto.
# Os modelos são carregados só no primeiro uso (a API sobe rápido) e, se faltar
# alguma coisa, a API NÃO cai:
#   - sem o arquivo .pt do YOLO -> modo "só OCR" (o EasyOCR procura o texto na imagem toda);
#   - sem o EasyOCR instalado   -> a leitura devolve None e o motivo aparece em status().
#
# Estratégia de leitura (para no primeiro resultado válido):
#   1. YOLO na imagem (limiar baixo, porque a placa da maquete é pequena);
#      se não achar nada, YOLO de novo com a imagem ampliada;
#   2. para cada caixa achada: OCR em versões diferentes do recorte (cinza, contraste, binária);
#   3. plano B: EasyOCR na imagem inteira ampliada (e girada 180°, para carro estacionado de ré).

import os
import threading
import time

import cv2

from utils import config
from utils.placa import normalizar_placa_ocr

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NOME_MODELO = "brazilian_license_plate_and_mercosul_plate.pt"
_CAMINHOS_MODELO = [
    config.PLACA_MODELO_YOLO,
    os.path.join(BASE_DIR, "models", NOME_MODELO),
    os.path.join(BASE_DIR, NOME_MODELO),
    os.path.join(os.getcwd(), "models", NOME_MODELO),
]
_ALLOWLIST = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -"
_TENTAR_DE_NOVO_APOS = 60.0  # s: se o carregamento falhou, tenta outra vez depois disso

_modelo_yolo = None
_leitor_ocr = None
_erro_carregamento = None
_ultima_falha = 0.0
_carregando = False
_lock = threading.Lock()
_lock_uso = threading.Lock()  # YOLO/EasyOCR não são thread-safe: entrada, saída e vagas usam um por vez


def _log(texto):
    if config.PLACA_DEBUG:
        print(texto)


def _achar_modelo():
    for caminho in _CAMINHOS_MODELO:
        if caminho and os.path.exists(caminho):
            return caminho
    return None


def carregar_modelos() -> bool:
    """Carrega EasyOCR (obrigatório) + YOLO (opcional) uma única vez. True = pronto para ler."""
    global _modelo_yolo, _leitor_ocr, _erro_carregamento, _ultima_falha, _carregando
    with _lock:
        if _leitor_ocr is not None:
            return True
        if _erro_carregamento and time.time() - _ultima_falha < _TENTAR_DE_NOVO_APOS:
            return False
        _carregando = True
        try:
            import easyocr
            _leitor_ocr = easyocr.Reader(["en"], gpu=False)

            caminho = _achar_modelo()
            if caminho:
                try:
                    from ultralytics import YOLO
                    _modelo_yolo = YOLO(caminho)
                except Exception as e:
                    print(f"⚠️  YOLO não carregou ({e}). Vou ler placas só com o EasyOCR.")
            else:
                print(f"⚠️  Modelo YOLO não encontrado (procurei {NOME_MODELO} em "
                      f"{os.path.join(BASE_DIR, 'models')}). Vou ler placas só com o EasyOCR.")

            _erro_carregamento = None
            modo = "YOLO + EasyOCR" if _modelo_yolo is not None else "só EasyOCR"
            print(f"🔤 Leitor de placas carregado ({modo}).")
            return True
        except Exception as e:
            _erro_carregamento = f"{type(e).__name__}: {e}"
            _ultima_falha = time.time()
            print(f"❌ Leitura de placas desativada: {_erro_carregamento}")
            print("   -> Confira: pip install easyocr ultralytics  (e o .pt em Back-End/models/)")
            return False
        finally:
            _carregando = False


def status() -> dict:
    """Usado pela rota / para o painel mostrar se o leitor está pronto ou qual foi o erro."""
    pronto = _leitor_ocr is not None
    return {
        "pronto": pronto,
        "modo": ("yolo+ocr" if _modelo_yolo is not None else "so_ocr") if pronto else None,
        "erro": None if pronto else _erro_carregamento,
        "carregando": _carregando,
    }


# ======================================================================
# OCR
# ======================================================================
def _variacoes(recorte_placa):
    """Versões do recorte para o OCR: placa da maquete é pequena, borrada e com reflexo."""
    cinza = cv2.cvtColor(recorte_placa, cv2.COLOR_BGR2GRAY) if recorte_placa.ndim == 3 else recorte_placa
    altura = cinza.shape[0]
    if altura < 100:
        escala = 100.0 / max(altura, 1)
        cinza = cv2.resize(cinza, None, fx=escala, fy=escala, interpolation=cv2.INTER_CUBIC)
    yield "cinza", cinza
    contraste = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(4, 4)).apply(cinza)
    yield "contraste", contraste
    nitida = cv2.addWeighted(contraste, 1.6, cv2.GaussianBlur(contraste, (0, 0), 3), -0.6, 0)
    _, binaria = cv2.threshold(nitida, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    yield "binaria", binaria


def _placa_dos_textos(resultados):
    """
    resultados = saída do readtext com detail=1: [(caixa, texto, confiança), ...].
    Tenta primeiro cada texto sozinho, do MAIOR para o menor (as letras da placa são
    maiores que a tarja BRASIL), depois tudo junto na ordem de leitura.
    Devolve (placa ou None, texto bruto).
    """
    if not resultados:
        return None, ""

    def altura(r):
        ys = [p[1] for p in r[0]]
        return max(ys) - min(ys)

    def posicao(r):
        return (min(p[1] for p in r[0]) // 20, min(p[0] for p in r[0]))

    bruto = " | ".join(f"{r[1]}({r[2]:.2f})" for r in sorted(resultados, key=posicao))
    for r in sorted(resultados, key=altura, reverse=True):
        placa = normalizar_placa_ocr(r[1])
        if placa:
            return placa, bruto
    junto = " ".join(r[1] for r in sorted(resultados, key=posicao))
    return normalizar_placa_ocr(junto), bruto


def _ler_texto(recorte_placa, rotulo):
    for nome, img in _variacoes(recorte_placa):
        resultados = _leitor_ocr.readtext(img, detail=1, allowlist=_ALLOWLIST)
        placa, bruto = _placa_dos_textos(resultados)
        _log(f"      OCR [{nome}] {rotulo}: '{bruto or '(nada)'}' -> {placa or 'inválida'}")
        if placa:
            return placa
    return None


# ======================================================================
# YOLO
# ======================================================================
def _caixas_yolo(imagem):
    """Caixas [(x1, y1, x2, y2, conf)] na escala da imagem original, da mais confiável à menos."""
    if _modelo_yolo is None:
        return []
    alt, larg = imagem.shape[:2]
    tentativas = [(imagem, 1.0)]
    if max(alt, larg) < 960:
        fator = 960.0 / max(alt, larg)
        tentativas.append((cv2.resize(imagem, None, fx=fator, fy=fator, interpolation=cv2.INTER_CUBIC), fator))

    for img, fator in tentativas:
        res = _modelo_yolo(img, conf=config.PLACA_CONFIANCA_YOLO, verbose=False)
        caixas = []
        for r in res:
            if r.boxes is None:
                continue
            for c in r.boxes:
                x1, y1, x2, y2 = [v / fator for v in c.xyxy[0].tolist()]
                caixas.append((x1, y1, x2, y2, float(c.conf[0])))
        if caixas:
            return sorted(caixas, key=lambda c: c[4], reverse=True)
    return []


def _recortar_com_margem(imagem, x1, y1, x2, y2, margem=0.12):
    alt, larg = imagem.shape[:2]
    mx, my = (x2 - x1) * margem, (y2 - y1) * margem
    x1, y1 = int(max(x1 - mx, 0)), int(max(y1 - my, 0))
    x2, y2 = int(min(x2 + mx, larg)), int(min(y2 + my, alt))
    return imagem[y1:y2, x1:x2]


# ======================================================================
# ENTRADA PÚBLICA
# ======================================================================
def extrair_placa_de_recorte(imagem, rotulo="imagem"):
    """
    Recebe uma imagem BGR (numpy/OpenCV): foto da ESP32-CAM ou recorte de uma vaga.
    'rotulo' só aparece no log (ex.: 'vaga 59F', 'ENTRADA').
    Retorna a placa (ex.: 'BRA2E19') ou None.
    """
    if imagem is None or getattr(imagem, "size", 0) == 0:
        return None
    if not carregar_modelos():
        return None

    with _lock_uso:
        inicio = time.time()
        alt, larg = imagem.shape[:2]
        _log(f"🔎 Placa ({rotulo}): imagem {larg}x{alt}")

        caixas = _caixas_yolo(imagem)
        if _modelo_yolo is not None:
            if caixas:
                _log("   YOLO achou: " + ", ".join(
                    f"[{int(c[0])},{int(c[1])},{int(c[2])},{int(c[3])}] conf {c[4]:.2f}" for c in caixas[:3]))
            else:
                _log(f"   YOLO não achou placa (conf >= {config.PLACA_CONFIANCA_YOLO}).")

        for i, (x1, y1, x2, y2, conf) in enumerate(caixas[:3]):
            recorte = _recortar_com_margem(imagem, x1, y1, x2, y2)
            if recorte.size == 0:
                continue
            placa = _ler_texto(recorte, f"caixa {i + 1}")
            if placa:
                _log(f"   ✅ Placa ({rotulo}): {placa} em {time.time() - inicio:.1f} s")
                return placa

        # Plano B: EasyOCR acha o texto sozinho na imagem inteira (ampliada se for pequena)
        base = imagem
        if max(alt, larg) < 800:
            fator = 800.0 / max(alt, larg)
            base = cv2.resize(imagem, None, fx=fator, fy=fator, interpolation=cv2.INTER_CUBIC)
        for nome, img in (("inteira", base), ("inteira girada 180°", cv2.rotate(base, cv2.ROTATE_180))):
            resultados = _leitor_ocr.readtext(img, detail=1, allowlist=_ALLOWLIST)
            placa, bruto = _placa_dos_textos(resultados)
            _log(f"      OCR [{nome}]: '{bruto or '(nada)'}' -> {placa or 'inválida'}")
            if placa:
                _log(f"   ✅ Placa ({rotulo}): {placa} em {time.time() - inicio:.1f} s")
                return placa

        _log(f"   ❌ Placa ({rotulo}) não lida ({time.time() - inicio:.1f} s)")
        return None
