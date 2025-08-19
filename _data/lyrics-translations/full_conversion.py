import yaml

class DoubleQuoted(str):
    pass

def double_quoted_presenter(dumper, data):
    return dumper.represent_scalar('tag:yaml.org,2002:str', data, style='"')

yaml.add_representer(DoubleQuoted, double_quoted_presenter)

def dq(s):
    return DoubleQuoted(s) if isinstance(s, str) else s

with open("original.yml", encoding="utf-8") as f:
    original = yaml.safe_load(f)
with open("romanized.yml", encoding="utf-8") as f:
    romanized = yaml.safe_load(f)
with open("english.yml", encoding="utf-8") as f:
    english = yaml.safe_load(f)
with open("language.yml", encoding="utf-8") as f:
    language = yaml.safe_load(f)
with open("explanation.yml", encoding="utf-8") as f:
    explanation = yaml.safe_load(f)

if not (len(original) == len(romanized) == len(english) == len(language) == len(explanation)):
    raise ValueError("Input files do not have the same number of lines.")

output = []
for o, r, e, l, ex in zip(original, romanized, english, language, explanation):
    if o == "[[divider]]":
        output.append({"divider": True})
    else:
        # Handle explanation
        if ex == "[[empty]]":
            explanation_field = None
        else:
            # Split by comma, strip whitespace, and double-quote each
            explanation_field = [dq(part.strip()) for part in ex.split(",") if part.strip()]
        output.append({
            "language": dq(l),
            "original": dq(o),
            "romanized": dq(r),
            "english": dq(e),
            "explanation": explanation_field
        })

def dump_with_blank_lines(data, file):
    for item in data:
        yaml.dump([item], file, allow_unicode=True, sort_keys=False, width=1000)
        file.write('\n')

with open("lyrics.yml", "w", encoding="utf-8") as f:
    dump_with_blank_lines(output, f)