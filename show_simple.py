from pathlib import Path
import sys
sys.stdout.reconfigure(encoding='utf-8')
text=Path('pages/LogPage.tsx').read_text(encoding='utf-8').splitlines()
for i,line in enumerate(text,1):
    if 'Simplificado' in line:
        for j in range(i-3,i+3):
            print(f"{j}: {text[j-1]}")
