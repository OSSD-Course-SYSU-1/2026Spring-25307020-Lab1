import os, re

root = r'D:\newcode\arkts_focal\entry\src\main\ets'

for root_dir, dirs, files in os.walk(root):
    for f in files:
        if not f.endswith('.ets'):
            continue
        path = os.path.join(root_dir, f)
        with open(path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        original = content
        
        # 1. Replace $$this. with this. (simple replacement)
        content = content.replace('$$this.', 'this.')
        
        # 2. Remove .columnStart(...) and .columnEnd(...) lines
        content = re.sub(r'\s+\.columnStart\(\d+\)\s*\n', '\n', content)
        content = re.sub(r'\s+\.columnEnd\(\d+\)\s*\n', '\n', content)
        
        # 3. Clean up extra blank lines
        content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)
        
        if content != original:
            with open(path, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f'Fixed: {path}')

print('Done!')
