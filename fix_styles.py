import os
import re

def process_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # Remove all rounded classes
    content = re.sub(r'\brounded(-[a-zA-Z0-9]+)?\b', '', content)
    
    # Remove blur classes
    content = re.sub(r'\bblur-\[[^\]]+\]\b', '', content)
    content = re.sub(r'\backdrop-blur-[a-zA-Z0-9]+\b', '', content)
    
    # Replace overly soft shadows with crisp shadows or remove them
    # For shadows with colors like shadow-[0_0_8px_#C8FF00], drop-shadow-[...]
    # We will replace them with a thin sharp shadow or remove.
    # Actually, let's just make shadow glow very sharp in globals.css, and remove explicit large shadows in templates.
    content = re.sub(r'shadow-\[0_0_[0-9]+px_[^\]]+\]', 'shadow-[2px_2px_0px_var(--color-primary)] opacity-80', content)
    content = re.sub(r'drop-shadow-\[0_0_[0-9]+px_[^\]]+\]', 'drop-shadow-[2px_2px_0_var(--color-primary)]', content)

    # Clean up double spaces created by removing classes
    content = re.sub(r' +', ' ', content)
    # Also clean spaces before quotes
    content = re.sub(r' "', '"', content)
    content = re.sub(r' \'', '\'', content)
    
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file_path}")

def walk_dir(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.tsx', '.ts')):
                process_file(os.path.join(root, file))

if __name__ == '__main__':
    walk_dir('src')
