# Cria um ambiente virtual Python chamado .venv
python -m venv .venv

# Ativa o ambiente virtual
source .venv/bin/activate

# Gera o arquivo requirements.txt a partir do requirements.in
pip-compile requirements.in

# Instala as dependências listadas no requirements.txt
pip install -r ./requirements.txt

# Inicia o servidor Flask usando o arquivo app.py
flask --app app.py run