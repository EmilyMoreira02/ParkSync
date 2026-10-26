# Arquivo: Back-End/utils/placa.py
#
# Limpeza do texto do OCR e validação de placas.
# Antes, o regex apagava "BR" em QUALQUER posição: a placa BRA2E19 virava "A2E19"
# e ABR1C23 virava "A1C23". Agora só as palavras da tarja (BRASIL/MERCOSUL) saem.
# O OCR aceita placa Mercosul e do modelo antigo (o cadastro aceita as duas).

import re
from typing import Optional

PADRAO_MERCOSUL = re.compile(r"^[A-Z]{3}[0-9][A-Z][0-9]{2}$")
PADRAO_ANTIGO = re.compile(r"^[A-Z]{3}[0-9]{4}$")

_PALAVRAS_TARJA = ("BRASIL", "BRAZIL", "MERCOSUL", "MERCOSUR")

_TIPOS_MERCOSUL = ["L", "L", "L", "N", "L", "N", "N"]
_TIPOS_ANTIGO = ["L", "L", "L", "N", "N", "N", "N"]
_LETRA_PARA_NUMERO = {"O": "0", "Q": "0", "D": "0", "U": "0", "I": "1", "L": "1", "J": "1", "B": "8",
                      "S": "5", "Z": "2", "G": "6", "T": "7", "A": "4", "E": "3"}
_NUMERO_PARA_LETRA = {"0": "O", "1": "I", "8": "B", "5": "S", "2": "Z", "6": "G", "7": "T", "4": "A", "3": "E"}


def _limpar(texto: str) -> str:
    """Remove só as palavras inteiras da tarja, depois hífen, espaço e símbolos."""
    texto = (texto or "").upper()
    # 1) Remove tokens que são exatamente palavras da tarja ("BRASIL BRA2E19" -> "BRA2E19")
    tokens = re.split(r"[^A-Z0-9]+", texto)
    tokens = [t for t in tokens if t and t not in _PALAVRAS_TARJA]
    junto = "".join(tokens)
    # 2) Se o OCR grudou a tarja na placa ("BRASILBRA2E19"), tira a palavra inteira,
    #    mas só se ainda sobrarem pelo menos 7 caracteres.
    for palavra in _PALAVRAS_TARJA:
        if palavra in junto:
            sem_palavra = junto.replace(palavra, "")
            if len(sem_palavra) >= 7:
                junto = sem_palavra
    return junto


def validar_placa_mercosul(texto: str) -> Optional[str]:
    limpo = _limpar(texto)
    return limpo if PADRAO_MERCOSUL.match(limpo) else None


def _corrigir_posicoes(sete_caracteres: str, tipos=_TIPOS_MERCOSUL, padrao=PADRAO_MERCOSUL) -> Optional[str]:
    """Troca confusões comuns do OCR conforme a posição (letra x número)."""
    corrigido = []
    for caractere, tipo in zip(sete_caracteres, tipos):
        if tipo == "L" and caractere.isdigit():
            caractere = _NUMERO_PARA_LETRA.get(caractere, caractere)
        elif tipo == "N" and caractere.isalpha():
            caractere = _LETRA_PARA_NUMERO.get(caractere, caractere)
        corrigido.append(caractere)
    resultado = "".join(corrigido)
    return resultado if padrao.match(resultado) else None


def normalizar_placa_ocr(texto: str) -> Optional[str]:
    """
    Recebe o texto bruto do OCR e devolve a placa (ex.: 'BRA2E19', ou 'ABC1234' no modelo antigo) ou None.
    Ordem: Mercosul exata, antiga exata, Mercosul corrigida (8RA2EI9 -> BRA2E19), antiga corrigida.
    """
    limpo = _limpar(texto)
    if len(limpo) < 7:
        return None
    janelas = [limpo[i:i + 7] for i in range(len(limpo) - 6)]
    for padrao in (PADRAO_MERCOSUL, PADRAO_ANTIGO):
        for janela in janelas:
            if padrao.match(janela):
                return janela
    for tipos, padrao in ((_TIPOS_MERCOSUL, PADRAO_MERCOSUL), (_TIPOS_ANTIGO, PADRAO_ANTIGO)):
        for janela in janelas:
            candidato = _corrigir_posicoes(janela, tipos, padrao)
            if candidato:
                return candidato
    return None


def limpar_placa_digitada(texto: str) -> Optional[str]:
    """Placa digitada no app/cadastro: 'bra-2e19' -> 'BRA2E19'. Aceita Mercosul e modelo antigo."""
    limpo = re.sub(r"[^A-Z0-9]", "", (texto or "").upper())
    if PADRAO_MERCOSUL.match(limpo) or PADRAO_ANTIGO.match(limpo):
        return limpo
    return None
