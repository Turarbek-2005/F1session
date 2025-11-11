import os

dirs = [
    'store/slices',
    'api',
    'types',
]

for dir in dirs:
    os.makedirs(dir, exist_ok=True)
    print(f'Created: {dir}')

print('Directory structure created successfully!')
