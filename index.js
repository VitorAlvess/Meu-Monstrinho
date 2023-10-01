import { ChatGPTUnofficialProxyAPI } from 'chatgpt'
import dotenv from 'dotenv'
import qrcode from 'qrcode-terminal';
import fs from 'fs';
import path from 'path'
import pkg from 'whatsapp-web.js';
dotenv.config()
const { Client, LocalAuth, MessageMedia } = pkg;
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
  if (message.body == '!help'){
    client.sendMessage(message.from, 'Atualmente possuo esses comandos: ')
  }
  else if (message.hasMedia) {
    const media = await message.downloadMedia();
    const folder = process.cwd() + '/img/' + phoneNumber
    const filename = folder + '/' + time + '_' + message.id.id + '.' + media.mimetype.split('/')[1];
    fs.mkdirSync(folder, { recursive: true });
    fs.writeFileSync(filename, Buffer.from(media.data, 'base64').toString('binary'), 'binary');
    console.log(`Imagem do Numero: ${phoneNumber} salva`)
  }
  else if(message.body == '!arquivo'){
    const folderPath = `./img/${phoneNumber}`; // Substitua pelo caminho da sua pasta

  
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error('Erro ao ler a pasta:', err);
        return;
      }

      // Filtra apenas os nomes de arquivos (ignora subpastas)
      const fileNames = files.filter((file) => {
        return fs.statSync(path.join(folderPath, file)).isFile();
      });

   
      client.sendMessage(message.from, `Você possui um total de ${fileNames.length} arquivos salvos na minha memória`)
     
      
    });
  }
  else if(message.body === '!arquivos'){

    const folderPath = `./img/${phoneNumber}`; // Substitua pelo caminho da sua pasta

  
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error('Erro ao ler a pasta:', err);
        return;
      }

      // Filtra apenas os nomes de arquivos (ignora subpastas)
      const fileNames = files.filter((file) => {
        return fs.statSync(path.join(folderPath, file)).isFile();
      });

      // Agora, fileNames contém um array com os nomes dos arquivos na pasta
      console.log('Nomes dos arquivos na pasta:');
      fileNames.forEach((fileName) => {
        const media = MessageMedia.fromFilePath(`${folderPath}/${fileName}`); // Caminho para a imagem
        client.sendMessage(message.from, media, { caption: '' });
        console.log(fileName);
      });
    });

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
 


