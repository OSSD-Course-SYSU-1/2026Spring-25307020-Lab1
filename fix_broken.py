import re, os

root = r'D:\newcode\arkts_focal\entry\src\main\ets'

for root_dir, dirs, files in os.walk(root):
    for f in files:
        if not f.endswith('.ets'):
            continue
        path = os.path.join(root_dir, f)
        with open(path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Fix broken replacements from previous run
        # Pattern: StorageService.load('theme', 'theme')'light' as string
        content = re.sub(r"StorageService\.load\(('[^']+')('[^']+')'([^']+') as (\w+)", r"StorageService.load(\1, \3) as \4", content)
        # Pattern: StorageService.load('subjects', [])'subjects' as Subject[]
        content = re.sub(r"StorageService\.load\((`[^`]+`\s*,\s*\[\])\)'[^']+' as (\w+\[?\]?)", r"StorageService.load(\1) as \2", content)
        content = re.sub(r"StorageService\.load\((`[^`]+`\s*,\s*\{\})\)'[^']+' as (\w+\[?\]?)", r"StorageService.load(\1) as \2", content)
        content = re.sub(r"StorageService\.load\((`[^`]+`\s*,\s*null)\)'[^']+' as (\w+\[?\]?)", r"StorageService.load(\1) as \2", content)
        
        # Also fix string literal patterns
        content = re.sub(r"StorageService\.load\(('[^']+')('[^']+')'([^']+') as (\w+)", r"StorageService.load(\1, \3) as \4", content)
        content = re.sub(r"StorageService\.load\((`[^`]+`\s*,\s*\[\])\)'[^']+' as (\w+\[?\]?)", r"StorageService.load(\1) as \2", content)
        
        with open(path, 'w', encoding='utf-8') as file:
            file.write(content)

print('Fixed broken replacements')
