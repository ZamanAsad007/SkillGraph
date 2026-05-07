import mistune


def normalize_repository_text(repository: dict) -> str:
    parts = [
        repository.get("name", ""),
        repository.get("description", ""),
        repository.get("readme", ""),
        " ".join(repository.get("commits", [])),
    ]
    markdown = "\n".join(part for part in parts if part)
    return mistune.html(markdown)
