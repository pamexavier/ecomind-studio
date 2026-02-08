import { GoogleAuth } from 'google-auth-library';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testVertexConnection() {
  console.log('🚀 Testando conexão com Vertex AI...\n');
  
  try {
    // 1. Verificar se arquivo existe
    const credsPath = './google-credentials.json';
    if (!fs.existsSync(credsPath)) {
      console.error('❌ ERRO: Arquivo google-credentials.json não encontrado!');
      console.log('📁 Por favor, coloque o arquivo na raiz do projeto.');
      console.log('   Ele deve estar AQUI:');
      console.log('   C:\\Users\\Administrator\\Desktop\\ENGENHARIA\\SISTEMA\\ecomind-studio-main\\');
      console.log('\n📋 Conteúdo da pasta atual:');
      const files = fs.readdirSync('.');
      files.forEach(file => console.log('   -', file));
      return;
    }
    
    console.log('✅ 1. Arquivo de credenciais encontrado\n');
    
    // 2. Ler credenciais
    const credentials = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
    
    console.log('✅ 2. Credenciais carregadas:');
    console.log('   📧 Email:', credentials.client_email);
    console.log('   🆔 Projeto:', credentials.project_id);
    console.log('   🔑 Key ID:', credentials.private_key_id?.substring(0, 20) + '...\n');
    
    // 3. Configurar autenticação
    console.log('🔄 3. Configurando autenticação Google...');
    const auth = new GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    
    // 4. Obter token
    console.log('🔐 4. Obtendo token de acesso...');
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    
    console.log('✅ Token obtido com sucesso!');
    console.log('   Token (início):', token.token?.substring(0, 30) + '...\n');
    
    // 5. Testar regiões do Vertex AI
    console.log('📡 5. Testando regiões do Vertex AI...\n');
    
    const projectId = credentials.project_id;
    const regions = ['us-central1', 'us-east4', 'europe-west4', 'asia-northeast3'];
    let workingRegion = null;
    
    for (const region of regions) {
      try {
        const url = `https://${region}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${region}/models`;
        
        console.log(`   🔍 Testando região: ${region}`);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 200) {
          const data = await response.json();
          console.log(`   ✅ ${region} FUNCIONOU!`);
          console.log(`      Modelos disponíveis: ${data.models?.length || 0}`);
          
          // Mostrar alguns modelos
          if (data.models && data.models.length > 0) {
            console.log('      📋 Alguns modelos:');
            data.models.slice(0, 3).forEach(model => {
              console.log(`         • ${model.displayName || model.name}`);
            });
          }
          
          workingRegion = region;
          break;
        } else {
          console.log(`   ⚠️  ${region}: Status ${response.status}`);
        }
      } catch (regionError) {
        console.log(`   ❌ ${region}: ${regionError.message}`);
      }
    }
    
    if (workingRegion) {
      console.log('\n🎉 🎉 🎉 CONFIGURAÇÃO BEM-SUCEDIDA! 🎉 🎉 🎉');
      console.log('\n📋 DADOS PARA SEU server.js:');
      console.log('   PROJECT_ID:', projectId);
      console.log('   REGION:', workingRegion);
      console.log('   CLIENT_EMAIL:', credentials.client_email);
      console.log('\n🚀 Agora você pode usar o código Vertex AI que te enviei!');
    } else {
      console.log('\n⚠️  Nenhuma região funcionou. Verifique:');
      console.log('   1. Vertex AI API está ativada?');
      console.log('   2. Projeto tem faturamento ativo?');
      console.log('   3. Permissões da conta de serviço estão corretas?');
      console.log('\n🔧 Ative as APIs necessárias:');
      console.log('   https://console.cloud.google.com/apis/library/aiplatform.googleapis.com');
      console.log('   https://console.cloud.google.com/apis/library/iamcredentials.googleapis.com');
    }
    
  } catch (error) {
    console.error('\n🔥 ERRO DURANTE O TESTE:');
    console.error('   Mensagem:', error.message);
    console.error('   Stack:', error.stack?.split('\n')[1]);
    
    if (error.message.includes('private_key')) {
      console.log('\n🔧 SOLUÇÃO:');
      console.log('   A chave privada está corrompida ou inválida.');
      console.log('   Crie uma NOVA chave JSON no Google Cloud Console.');
    }
    
    if (error.message.includes('credentials')) {
      console.log('\n🔧 Verifique o arquivo google-credentials.json:');
      console.log('   - Está no formato JSON válido?');
      console.log('   - Tem todas as propriedades necessárias?');
      console.log('   - A chave privada está completa?');
    }
  }
}

// Executar o teste
testVertexConnection();