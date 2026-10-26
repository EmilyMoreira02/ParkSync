// Textos da landing page, baseados no README do projeto.
// Afirmações numéricas foram reescritas para descrever o que o sistema faz hoje.

export const REPO_URL = 'https://github.com/GhostDev-Creator/ParkSync'

export const NAV = [
  { id: 'visao', label: 'Visão' },
  { id: 'arquitetura', label: 'Arquitetura' },
  { id: 'matriz', label: 'Matriz' },
  { id: 'vagas', label: 'Vagas' },
  { id: 'stack', label: 'Stack' },
  { id: 'modulos', label: 'Módulos' },
  { id: 'equipe', label: 'Equipe' },
]

export const HERO_SPECS = [
  { value: '2', unit: 'fatores', label: 'rosto do morador + placa do veículo dele' },
  { value: '5', unit: 'cenários', label: 'na matriz de decisão da portaria' },
  { value: '3', unit: 'ESP32', label: 'na borda: WROOM + duas ESP32-CAM' },
  { value: 'RT', unit: 'WebSocket', label: 'eventos ao vivo no painel do porteiro' },
]

export const PROBLEMS = [
  {
    code: 'P-01',
    title: 'Credenciais que se copiam',
    text: 'Controle remoto, tag e cartão podem ser clonados, emprestados ou perdidos. Quem segura o objeto entra, seja quem for.',
  },
  {
    code: 'P-02',
    title: 'Conferência no olho',
    text: 'A portaria depende da atenção de uma pessoa para comparar rosto, placa e lista de visitas, a qualquer hora do dia.',
  },
  {
    code: 'P-03',
    title: 'Pátio sem controle',
    text: 'Vaga ocupada pelo carro errado só é descoberta quando o morador chega e encontra o espaço tomado.',
  },
]

export const SOLUTIONS = [
  {
    code: 'S-01',
    title: 'Dupla checagem biométrica',
    text: 'A cancela só abre quando o rosto reconhecido e a placa lida pertencem ao mesmo morador, ou quando há visita agendada válida.',
  },
  {
    code: 'S-02',
    title: 'Trilha de auditoria',
    text: 'Cada decisão da portaria, automática ou manual, vira um registro com direção, tipo, motivo e horário.',
  },
  {
    code: 'S-03',
    title: 'Pátio monitorado',
    text: 'Uma câmera acompanha as vagas, lê a placa de quem estacionou e avisa o painel quando o carro não é do apartamento da vaga.',
  },
]

// Etapas do fluxo de entrada; `edges` aponta para os ids dos caminhos no diagrama.
export const FLOW_STEPS = [
  {
    title: 'Presença detectada',
    text: 'O ultrassônico da cancela percebe o veículo e o ESP32-WROOM publica o evento no broker MQTT.',
    edges: ['e-wroom-mqtt', 'e-mqtt-orq'],
  },
  {
    title: 'Câmera acordada',
    text: 'O orquestrador manda a ESP32-CAM do lado certo (entrada ou saída) sair do modo de espera e fotografar a placa.',
    edges: ['e-cmd-in', 'e-cmd-out'],
  },
  {
    title: 'Leitura da placa',
    text: 'A foto chega ao serviço de LPR: o YOLO localiza a placa e o EasyOCR lê os caracteres, filtrados pelo padrão brasileiro.',
    edges: ['e-cam-in-lpr', 'e-cam-out-lpr', 'e-lpr-orq'],
  },
  {
    title: 'Reconhecimento facial',
    text: 'A webcam da guarita captura o rosto; o serviço facial gera o vetor de 128 dimensões e compara com os moradores.',
    edges: ['e-webcam-face', 'e-face-orq'],
  },
  {
    title: 'Matriz de decisão',
    text: 'O orquestrador cruza rosto, placa, veículos e agenda de visitas no MySQL e escolhe um dos cinco cenários.',
    edges: ['e-orq-db'],
  },
  {
    title: 'Cancela acionada',
    text: 'Se liberado, o comando volta pelo MQTT ao ESP32-WROOM, que gira o servo e abre a cancela.',
    edges: ['e-mqtt-orq', 'e-wroom-mqtt'],
    reverse: true,
  },
  {
    title: 'Painel ao vivo',
    text: 'O resultado vai em JSON por WebSocket para o painel do porteiro; o app do morador recebe as notificações pela API REST.',
    edges: ['e-orq-ws', 'e-ws-painel', 'e-api-app'],
  },
]

export const SCENARIOS = [
  {
    id: 'morador',
    code: 'C-01',
    title: 'Morador reconhecido',
    face: true,
    plate: 'Placa do morador',
    gate: 'open',
    action: 'Acesso liberado e entrada registrada no log.',
    tone: 'ok',
  },
  {
    id: 'temporario',
    code: 'C-02',
    title: 'Veículo temporário',
    face: true,
    plate: 'Placa não cadastrada',
    gate: 'open',
    action: 'Acesso liberado. A placa fica registrada como veículo temporário do morador, evitando falso conflito no pátio.',
    tone: 'ok',
  },
  {
    id: 'visitante',
    code: 'C-03',
    title: 'Visitante autorizado',
    face: false,
    plate: 'Visita agendada e no horário',
    gate: 'open',
    action: 'Acesso liberado com base no agendamento feito pelo morador, com registro de segurança.',
    tone: 'ok',
  },
  {
    id: 'expirado',
    code: 'C-04',
    title: 'Visita fora do período',
    face: false,
    plate: 'Agendamento expirado ou cancelado',
    gate: 'locked',
    action: 'Cancela travada e mediação enviada ao porteiro pelo WebSocket, que pode liberar manualmente.',
    tone: 'warn',
  },
  {
    id: 'invasao',
    code: 'C-05',
    title: 'Tentativa de invasão',
    face: false,
    plate: 'Placa desconhecida',
    gate: 'locked',
    action: 'Cancela travada, evento gravado na auditoria e alerta disparado no painel do porteiro.',
    tone: 'alert',
  },
]

export const FACE_OPTIONS = [
  { id: 'ok', label: 'Rosto reconhecido' },
  { id: 'no', label: 'Rosto não reconhecido' },
]

export const PLATE_OPTIONS = [
  { id: 'morador', label: 'Placa do morador' },
  { id: 'nova', label: 'Placa não cadastrada' },
  { id: 'visita', label: 'Visita agendada' },
  { id: 'expirada', label: 'Visita expirada' },
]

// Resolve o cenário a partir das entradas do simulador.
export function resolveScenario(face, plate) {
  if (face === 'ok') return { id: plate === 'morador' ? 'morador' : 'temporario' }
  if (plate === 'visita') return { id: 'visitante' }
  if (plate === 'expirada') return { id: 'expirado' }
  if (plate === 'morador') {
    return { id: 'invasao', note: 'A placa sozinha não abre a cancela: sem o rosto do dono, o acesso é negado.' }
  }
  return { id: 'invasao' }
}

export const PARKING_STEPS = [
  {
    code: '01',
    title: 'Comparação com o fundo vazio',
    text: 'Cada vaga é um polígono calibrado sobre a imagem. O frame atual é comparado com a foto do pátio vazio para saber se há algo ali.',
  },
  {
    code: '02',
    title: 'Placa localizada pelo YOLO',
    text: 'Quando a vaga muda de estado, o recorte passa por um modelo YOLO que encontra a placa do veículo.',
  },
  {
    code: '03',
    title: 'Leitura com EasyOCR',
    text: 'Os caracteres são lidos com margem extra e filtrados pelos formatos de placa antigo e Mercosul.',
  },
  {
    code: '04',
    title: 'Cruzamento com o apartamento',
    text: 'A vaga N pertence à unidade N. Se a placa não é do morador, de um veículo temporário dele ou de um visitante, o painel recebe um alerta de conflito.',
  },
]

export const STACK = [
  { layer: 'API & Core', part: 'PY-311', tech: 'Python 3.11 · FastAPI', role: 'REST, WebSockets e orquestração dos serviços.', pins: 8 },
  { layer: 'Banco de dados', part: 'DB-SQL', tech: 'MySQL · SQLAlchemy', role: 'Moradores, veículos, visitas, vagas e logs com integridade relacional e schemas Pydantic.', pins: 8 },
  { layer: 'IoT & mensageria', part: 'MQ-TT1', tech: 'Mosquitto MQTT', role: 'Pub/Sub entre as placas ESP32 e o backend.', pins: 6 },
  { layer: 'Visão computacional', part: 'CV-128', tech: 'OpenCV · dlib', role: 'Embeddings faciais de 128 dimensões e processamento de imagem.', pins: 8 },
  { layer: 'Inteligência artificial', part: 'AI-YOLO', tech: 'YOLO · EasyOCR', role: 'Localização da placa e leitura de caracteres (LPR).', pins: 8 },
  { layer: 'Hardware edge', part: 'ESP-32', tech: 'ESP32-WROOM · ESP32-CAM', role: 'Ultrassônicos, servos das cancelas e captura sob demanda.', pins: 10 },
  { layer: 'Interfaces', part: 'UI-WEB', tech: 'HTML/JS · Expo (React Native)', role: 'Painel do porteiro, cadastro, mapa de vagas e app do morador.', pins: 6 },
]

export const MODULES = [
  {
    id: 'backend',
    ref: 'U1',
    title: 'Back-End',
    tag: 'FastAPI',
    text: 'Orquestrador, serviços de face, placa e vagas, API REST e canal WebSocket. Fala MQTT com o hardware e HTTP com as câmeras.',
  },
  {
    id: 'porteiro',
    ref: 'U2',
    title: 'Painel do porteiro',
    tag: 'Web',
    text: 'Eventos de entrada e saída em tempo real, alertas de invasão e conflito, e liberação manual da cancela com motivo registrado.',
  },
  {
    id: 'cadastro',
    ref: 'U3',
    title: 'Cadastro',
    tag: 'Web',
    text: 'Registro de moradores, unidades, veículos e captura do rosto que gera o embedding usado na portaria.',
  },
  {
    id: 'vagas',
    ref: 'U4',
    title: 'Mapa de vagas',
    tag: 'Web',
    text: 'Planta do pátio com o estado de cada vaga (livre, ocupada, conflito) e a placa lida em cada uma.',
  },
  {
    id: 'app',
    ref: 'U5',
    title: 'App do morador',
    tag: 'Expo',
    text: 'Login do morador, gestão dos próprios veículos, agendamento de visitas, consulta da vaga e notificações da unidade.',
  },
  {
    id: 'firmware',
    ref: 'U6',
    title: 'Firmware',
    tag: 'ESP32',
    text: 'WROOM com dois ultrassônicos e dois servos; duas ESP32-CAM, uma por lado, que acordam para fotografar a placa.',
  },
]

export const TEAM = [
  { name: 'João Guilherme da Silva', role: 'Full-Stack IoT', github: 'GhostDev-Creator' },
  { name: 'Emily Cesar Moreira', role: 'Front-End Mobile', github: 'EmilyMoreira02' },
  { name: 'Hudson Henrique Silva Bento', role: 'Front-End Mobile', github: 'hudson1902' },
  { name: 'Amanda Savoy Nunes', role: 'Front-End', github: 'Amandasavoy' },
]
