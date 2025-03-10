import React from "react";
import { Icon } from "@base";

interface StarRatingProps {
  maxCount?: number;
  color?: string;
  iconName?: string;
  size?: "small" | "medium" | "large";
  iconScale?: string;
  rating?: number;
}

const StarRating: React.FC<StarRatingProps> = ({
  maxCount = 5,
  color = "gold",
  iconName = "star",
  size = "medium",
  iconScale = "lg",
  rating = 0,
}) => {
    
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  return (
    <div style={{ display: "flex", gap: "4px", cursor: "pointer" }}>
      {[...Array(maxCount)].map((_, index) => {
        let starIcon = `${iconName}-o`;
        if (index < fullStars) {
          starIcon = iconName;
        } else if (index === fullStars && hasHalfStar) {
          starIcon = `${iconName}-half`;
        }
        return (
          <span key={index} style={{ fontSize: "24px" }}>
            <Icon
              name={starIcon}
              color={color}
              size={size}
              iconScale={iconScale}
            />
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
