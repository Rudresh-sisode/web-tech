import subprocess

packages = ['openpyxl', 'QuantLib', 'pandas']

for package in packages:
    subprocess.check_call(['pip', 'install', package])