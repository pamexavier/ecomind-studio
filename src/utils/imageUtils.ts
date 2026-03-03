/**
 * Redimensiona a imagem para um máximo de 1024px e comprime para JPEG.
 * Isso reduz o custo de tokens em até 70% por imagem.
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

        canvas.toBlob(
          (blob) => blob ? resolve(blob) : reject(new Error("Erro no Blob")),
          "image/jpeg",
          0.8
        );
      };
    };
  });
}

/**
 * Converte o Blob redimensionado para o formato Base64 exigido pelo Gemini.
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