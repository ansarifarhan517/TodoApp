import React, { useEffect, useState } from "react";

interface TagInputProps {
    onTagsChange: (tags: string[]) => void;
    value: string[]
}

const TagInput: React.FC<TagInputProps> = ({ onTagsChange, value }) => {
    const [inputValue, setInputValue] = useState("");
    const [tags, setTags] = useState<string[]>([]);

    useEffect(() => {
        if (value.length === 0) {
          setInputValue("");
          setTags([])
        }
      }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            if (inputValue.trim() !== "") {
                const newTags = [...tags, inputValue.trim()];
                setTags(newTags);
                onTagsChange(newTags);
                setInputValue("");
            }
        }
    };

    const removeTag = (tag: string) => {
        const filteredTags = tags.filter((t) => t !== tag);
        setTags(filteredTags);
        onTagsChange(filteredTags);
    };

    return (
        <div style={{ border: "1px solid gray", padding: "8px", borderRadius: "4px" }}>
            {tags.map((tag) => (
                <span key={tag} style={{ marginRight: "8px", padding: "4px", background: "#ddd", borderRadius: "4px" }}>
                    {tag} <button onClick={() => removeTag(tag)}>x</button>
                </span>
            ))}
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type tags and press Enter"
            />
        </div>
    );
};

export default TagInput;
