import os
import zipfile

os.makedirs('public', exist_ok=True)
exclude_dirs = {'.git', 'node_modules', 'dist', '.cache', '__pycache__', 'public'}
exclude_files = {'vortex-games.zip', 'bun.lock'}

with zipfile.ZipFile('public/vortex-games.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith('.')]
        for f in files:
            if f in exclude_files or f.endswith('.pyc'):
                continue
            filepath = os.path.join(root, f)
            arcname = os.path.relpath(filepath, '.')
            zipf.write(filepath, arcname)

print('Updated public/vortex-games.zip, size:', os.path.getsize('public/vortex-games.zip'))
