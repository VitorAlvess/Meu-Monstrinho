import { ChatGPTUnofficialProxyAPI } from 'chatgpt'
import dotenv from 'dotenv'
import qrcode from 'qrcode-terminal';

import pkg from 'whatsapp-web.js';
dotenv.config()
const { Client, LocalAuth } = pkg;
const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', message => {
    console.log(message.body);
	if(message.body === '!ping') {
		client.sendMessage(message.from, 'pong');
	}
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
      console.log('Pensando.....')
      const response = await example(mensagem);
      console.log(response);
      client.sendMessage(message.from, response)
     
    }
    
  main(message.body)
    
  } catch (error) {
    client.sendMessage(message.from, 'Poderia tentar enviar novamente? Não estou conseguindo ler sua mensagem')
    
  }
    
    
    
    
   
    
});
 
client.initialize();
 


