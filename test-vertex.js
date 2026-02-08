const { GoogleAuth } = require('google-auth-library');
const fs = require('fs');

async function testVertexConnection() {
  console.log('🚀 Testando conexão com Vertex AI...\n');
  
  try {
    // 1. Verificar se arquivo existe
    if (!fs.existsSync('./google-credentials.json')) {
      console.error('❌ ERRO: Arquivo google-credentials.json não encontrado!');
      console.log('📁 Por favor, coloque o arquivo na raiz do projeto.');
      console.log('   Ele deve estar AQUI:');
      console.log('   C:\\Users\\Administrator\\Desktop\\ENGENHARIA\\SISTEMA\\ecomind-studio-main\\');
      return;
    }
    
    console.log('✅ 1. Arquivo de credenciais encontrado\n');
    
    // 2. Ler credenciais
    const credentials = JSON.parse(fs.readFileSync('./google-credentials.json', 'utf8'));
    
    console.log('✅ 2. Credenciais carregadas:');
    console.log('   📧 Email:', credentials.client_email);
    console.log('   🆔 Projeto:', credentials.project_id);
    console.log('   🔑 Key ID:', credentials.private_key_id.substring(0, 20) + '...\n');
    
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
    console.log('   Token (início):', token.token.substring(0, 30) + '...\n');
    
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
          console.log(`   ✅ ${region} FUNCIONOU!`);
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
    }
    
  } catch (error) {
    console.error('\n🔥 ERRO DURANTE O TESTE:');
    console.error('   Mensagem:', error.message);
    
    if (error.message.includes('private_key')) {
      console.log('\n🔧 SOLUÇÃO:');
      console.log('   A chave privada está corrompida ou inválida.');
      console.log('   Crie uma NOVA chave JSON no Google Cloud Console.');
    }
  }
}

// Executar o teste
testVertexConnection();
