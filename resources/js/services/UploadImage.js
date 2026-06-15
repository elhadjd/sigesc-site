export const useUploadImage = ((formulary)=>{

const onFileChange = (e) => {
    var files = e.target.files || e.dataTransfer.files;
    let arquivo = files[0].name;
    let extension = arquivo.indexOf(".") < 1 ? "" : arquivo.split(".").pop();
    if (extension == "") {
      return false;
    } else {
      let formatos_permitidos = [
        "jpg",
        "png",
        "gif",
        "jpeg",
        "JPG",
        "PNG",
        "GIF",
        "JPEG",
      ];
      let resultado = formatos_permitidos.includes(extension);
      if (resultado) {
        var tamanho_maximo = 2242880;
        var fsizet = 0;
        for (var i = 0; i <= e.target.files.length - 1; i++) {
          var fsize = e.target.files.item(i).size;
          fsizet = fsizet + fsize;
        }
        if (fsizet > tamanho_maximo) {
          console.log("tamanho de imagem muito grande");
        } else {
          createImg(files[0]);
        }
      }
    }
  };

  const createImg = (file) => {
    var imagem = new Image();
    var reader = new FileReader();

    reader.onload = (e) => {
      formulary.image = e.target.result;
    };

    reader.readAsDataURL(file);
  };


  return {createImg,onFileChange,formulary}

})
