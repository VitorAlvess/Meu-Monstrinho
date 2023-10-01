import { ChatGPTUnofficialProxyAPI } from 'chatgpt'
import dotenv from 'dotenv'
import qrcode from 'qrcode-terminal';
import fs from 'fs';
import pkg from 'whatsapp-web.js';
dotenv.config()
const { Client, LocalAuth } = pkg;
const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});
client.on('loading_screen', (percent, message) => {
  console.log('LOADING SCREEN', percent, message);
});

client.on('ready', () => {
    console.log('Client is ready!');
    client.sendMessage('5511945274604@c.us', `Olá, Estou funcionando!!`);
});

client.on('message', async message => {
  const time = new Date(message.timestamp * 1000).toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')[1].replaceAll(':', '-')
  const date = new Date(message.timestamp * 1000).toISOString().substring(0, 10);
  const person = message['_data']['notifyName'];
  const phoneNumber = message.from.replaceAll('@c.us', '');
  
  console.log(message.body);
  if (message.hasMedia) {
    const media = await message.downloadMedia();
    const folder = process.cwd() + '/img/' + phoneNumber
    const filename = folder + '/' + time + '_' + message.id.id + '.' + media.mimetype.split('/')[1];
    fs.mkdirSync(folder, { recursive: true });
    fs.writeFileSync(filename, Buffer.from(media.data, 'base64').toString('binary'), 'binary');
    console.log(`Imagem do Numero: ${phoneNumber} salva`)
  }
	else{

    try {
      async function example(mensagem) {
        const api = new ChatGPTUnofficialProxyAPI({
          accessToken: process.env.OPENAI_ACCESS_TOKEN,
          apiReverseProxyUrl: 'https://ai.fakeopen.com/api/conversation'
        })
      
        const res = await api.sendMessage(mensagem)
        
        return res.text
      }
      async function main(mensagem) {
        console.log('CHATGPT: Pensando.....')
        const response = await example(mensagem);
        console.log(response);
        client.sendMessage(message.from, response)
       
      }
      
    main(message.body)
      
    } catch (error) {
      client.sendMessage(message.from, 'Poderia tentar enviar novamente? Não estou conseguindo ler sua mensagem')
      
    }
  }
    
    
    
    
   
    
});
 
client.initialize();
 


