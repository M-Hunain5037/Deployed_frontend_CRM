import re

with open('EmployeeAttendancePage.jsx', 'r', encoding='utf-8', errors='replace') as f:
    lines = f.readlines()

# Find and fix the table header section (around line 1140-1155)
output_lines = []
in_table_header = False
table_header_start = -1

for i, line in enumerate(lines):
    # Detect table header section
    if '<thead>' in line:
        in_table_header = True
        table_header_start = i
    
    # If we're in the header and find the closing th with Remarks-like content
    if in_table_header and i > table_header_start + 5:
        if '</thead>' in line:
            # Insert new headers before this line
            if 'Remarks' not in ''.join(output_lines[-5:]):
                # Add the headers we're missing
                output_lines.append('                <th className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">\n')
                output_lines.append('                  Total Working Hours\n')
                output_lines.append('                </th>\n')
                output_lines.append('                <th className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">\n')
                output_lines.append('                  Remarks\n')
                output_lines.append('                </th>\n')
            output_lines.append(line)
            in_table_header = False
            continue
    
    # Skip lines that only have corrupted emojis
    if line.strip() and len(line.strip()) < 20 and any(ord(c) > 127 for c in line):
        # This is likely a corrupted emoji line, skip it
        continue
    
    # Clean up corrupted emoji characters from the line
    line = re.sub(r'ðŸ["\w]*', '', line)
    line = re.sub(r'â±ï¸', '', line)
    line = re.sub(r'ðŸ[\w"]*', '', line)
    
    output_lines.append(line)

with open('EmployeeAttendancePage.jsx', 'w', encoding='utf-8') as f:
    f.writelines(output_lines)

print("✅ Fixed table structure")
