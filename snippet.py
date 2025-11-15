from pathlib import Path
import sys
sys.stdout.reconfigure(encoding='utf-8')
lines=Path('components/LogSections.tsx').read_text(encoding='utf-8').splitlines()
for i in range(200,270):
    print(f"{i+1}: {lines[i]}")
