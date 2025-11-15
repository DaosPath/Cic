from pathlib import Path
import sys
sys.stdout.reconfigure(encoding='utf-8')
text=Path('pages/LogPage.tsx').read_text(encoding='utf-8').splitlines()
for i,line in enumerate(text,1):
    if 220<=i<=260:
        print(f"{i}: {line}")
