/**
 * Redimensiona a imagem para otimizar tokens e velocidade da IA.
 */
export async function resizeImage(file: File, maxWidth = 1024): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onerror = (e) => reject(e);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Mantém a proporção original, limitando a largura máxima
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
        }

        // Converte para JPEG com 80% de qualidade (Equilíbrio perfeito entre peso e nitidez)
        canvas.toBlob(
          (blob) => blob ? resolve(blob) : reject(new Error("Erro ao processar imagem")),
          "image/jpeg",
          0.8
        );
      };
    };
  });
}

/**
 * Converte o Blob para o formato inlineData que o Gemini exige.
 */
export async function fileToGenerativePart(blob: Blob) {
  const base64Data = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
    reader.readAsDataURL(blob);
  });

  return {
    inlineData: {
      data: base64Data,
      mimeType: "image/jpeg"
    }
  };
}