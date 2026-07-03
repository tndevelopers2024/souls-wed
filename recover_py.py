import json
import re
import os
import urllib.parse

log_file = '/Users/mohan/.gemini/antigravity-ide/brain/77751e28-f438-43ce-bd1c-9da577a0e298/.system_generated/logs/transcript_full.jsonl'
files_to_recover = {}

with open(log_file, 'r') as f:
    for line in f:
        try:
            entry = json.loads(line)
            if entry.get('type') == 'TOOL_RESPONSE' and 'tool_responses' in entry:
                for tr in entry['tool_responses']:
                    if tr.get('name') == 'default_api:view_file':
                        output = tr.get('response', {}).get('output', '')
                        match = re.search(r'File Path: `file://([^`]+)`', output)
                        if match:
                            file_path = urllib.parse.unquote(match.group(1))
                            
                            lines = output.split('\n')
                            content = []
                            is_code = False
                            for l in lines:
                                line_match = re.match(r'^\d+:\s(.*)$', l)
                                if line_match:
                                    content.append(line_match.group(1))
                                    is_code = True
                                elif is_code:
                                    if 'The above content' in l:
                                        break
                            
                            if content:
                                files_to_recover[file_path] = '\n'.join(content)
        except Exception as e:
            pass

for file_path, content in files_to_recover.items():
    if 'souls-wed' in file_path and not os.path.exists(file_path):
        print(f"Recovering {file_path}")
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, 'w') as f:
            f.write(content)
