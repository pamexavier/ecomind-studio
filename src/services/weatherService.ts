// src/services/weatherService.ts

const API_KEY = '41b4eff60615c194ed06ad7b476fd638'; // <--- COLE SUA CHAVE AQUI

export async function getWeatherData(lat: number, lon: number) {
  try {
    // Chamamos a API pedindo os dados em Português (lang=pt_br) e unidades métricas (units=metric)
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`
    );
    
    if (!response.ok) throw new Error('Falha ao buscar clima');
    
    const data = await response.json();
    
    return {
      temp: data.main.temp,
      tempMax: data.main.temp_max,
      descricao: data.weather[0].description,
      cidade: data.name,
      humidade: data.main.humidity,
      // Se estiver a chover no momento, a API avisa
      chuva: data.rain ? 'Possibilidade de chuvas frequentes' : 'Sem chuvas no momento'
    };
  } catch (error) {
    console.error("Erro ao buscar dados do clima:", error);
    return null;
  }
}
