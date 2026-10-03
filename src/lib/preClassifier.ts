interface PreClassification {
  area: string;
  type: string;
  category: string;
}

export interface Rule {
  keyword: string;
  area: string;
  type: string;
  category: string;
}

/**
 * Attempt to classify a transaction description using regex/substring rules locally.
 */
export function preClassify(description: string, rules: Rule[]): PreClassification | null {
  if (!description || !rules) return null;
  const descLower = description.toLowerCase();

  for (const rule of rules) {
    if (descLower.includes(rule.keyword.toLowerCase())) {
      return {
        area: rule.area,
        type: rule.type,
        category: rule.category
      };
    }
  }

  return null;
}

