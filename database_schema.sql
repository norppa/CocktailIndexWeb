CREATE TABLE ci_methods (
    name VARCHAR(32),
    PRIMARY KEY (name)
);

CREATE TABLE ci_ingredients (
    name VARCHAR(32),
    PRIMARY KEY (name)
);

CREATE TABLE ci_glasses (
    name VARCHAR(32),
    PRIMARY KEY (name)
);

CREATE TABLE ci_cocktails (
    id INT AUTO_INCREMENT,
    name VARCHAR(32),
    garnish VARCHAR(32),
    method VARCHAR(32),
    glass VARCHAR(32),
    info VARCHAR(128),
    PRIMARY KEY (id),
    FOREIGN KEY (method) REFERENCES ci_methods(name),
    FOREIGN KEY (glass) REFERENCES ci_glasses(name)
);

CREATE TABLE ci_ingredient_items (
    id INT AUTO_INCREMENT,
    amount VARCHAR(16),
    ingredient VARCHAR(32) NOT NULL,
    cocktail INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (ingredient) REFERENCES ci_ingredients(name),
    FOREIGN KEY (cocktail) REFERENCES ci_cocktails(id)
);

drop table ci_methods, ci_ingredients, ci_glasses, ci_cocktails, ci_ingredient_items;