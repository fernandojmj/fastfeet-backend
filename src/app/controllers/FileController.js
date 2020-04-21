import modelFile from "./../models/File";

class FileController {
  async store(request, response) {
    try {
      console.log("entrou no back");
      const { originalname: name, filename: path } = request.file;

      const file = await modelFile.create({
        name,
        path,
      });

      return response.status(201).json(file);
    } catch (error) {
      console.log("erro no back");
      return response.status(400).json({ error: "Erro interno" });
    }
  }
}

module.exports = new FileController();
