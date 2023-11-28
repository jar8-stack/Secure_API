# Usa una imagen base de Python
FROM python:3.8

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos necesarios al contenedor
COPY requirements.txt .
COPY main.py .

# Instala las dependencias
RUN pip install --no-cache-dir -r requirements.txt


# Comando para ejecutar tu script
CMD ["python", "main.py"]
