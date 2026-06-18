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
        
        # 1. Fix imports for API 9
        content = content.replace("from '@kit.ArkData'", "from '@ohos.data.preferences'")
        content = content.replace("from '@kit.AbilityKit'", "from '@ohos.app.ability'")
        content = content.replace("from '@kit.ArkUI'", "from '@ohos.arkui'")
        
        # 2. Fix this. in static methods (replace with class name)
        # This is done per file based on class name
        
        if content != original:
            with open(path, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f'Fixed imports: {f}')

print('Done fixing imports!')
