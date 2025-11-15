from pathlib import Path
import sys
sys.stdout.reconfigure(encoding='utf-8')
text=Path('pages/LogPage.tsx').read_text(encoding='utf-8').splitlines()
for i,line in enumerate(text,1):
    if 'Registro con IA' in line:
        for j in range(i-5,i+5):
            print(f"{j}: {text[j-1]}")
