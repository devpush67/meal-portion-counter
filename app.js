const STORAGE_KEY = 'meal_portion_counter.cookbook.v1';
const LANGUAGE_KEY = 'meal_portion_counter.language.v1';

const translations = {
  en: {
    cookbookTitle: 'Cookbook',
    savedRecipesLabel: 'Saved recipes',
    loadSelectedRecipe: 'Load selected recipe',
    deleteRecipe: 'Delete recipe',
    mealPlanner: 'Meal planner',
    appTitle: 'Meal Portion Counter',
    mealNameLabel: 'Meal name',
    totalMealWeightLabel: 'Total meal weight (g)',
    portionCountLabel: 'Number of portions',
    ingredientsTitle: 'Ingredients',
    addIngredient: '+ Add ingredient',
    calculatePortions: 'Calculate portions',
    saveRecipe: 'Save recipe',
    newMeal: 'New meal',
    perPortionBreakdown: 'Per-portion breakdown',
    ingredientChangesDetected: 'Ingredient changes detected',
    ingredientListChangedText: 'The ingredient list has changed. You can save it as a new recipe or overwrite the existing one.',
    newRecipeNameLabel: 'New recipe name',
    saveAsNewRecipe: 'Save as new recipe',
    overwriteExistingRecipe: 'Overwrite existing recipe',
    cancel: 'Cancel',
    noValidIngredients: 'No valid ingredients',
    noIngredientsMessage: 'Enter ingredients and portion counts to calculate a breakdown.',
    readyMessage: 'Ready',
    emptyRecipeState: 'Add a recipe and click “Calculate portions” to see the breakdown.',
    noRecipesSaved: 'No recipes saved yet.',
    selectRecipe: 'Select a recipe',
    portions: 'portions',
    ingredients: 'ingredients',
    recipeNamePlaceholder: 'e.g. Chicken rice bowl',
    recipeCopyPlaceholder: 'Recipe copy',
    pleaseNameMeal: 'Please give the meal a name before saving.',
    promptDeleteRecipe: 'Delete "{name}" from the cookbook?',
    selectRecipeToDelete: 'Select a recipe to delete first.',
    modalPrompt: 'The ingredient list for "{name}" was changed. Would you like to keep it as a new recipe or overwrite the current one?',
    gramsPerPortion: '{value} g / portion',
    ingredientNameHint: 'Ingredient',
    ingredientWeightHint: 'Weight (g)',
    port: 'portion',
    notAvailable: 'N/A',
  },
  cs: {
    cookbookTitle: 'Kuchařka',
    savedRecipesLabel: 'Uložené recepty',
    loadSelectedRecipe: 'Načíst vybraný recept',
    deleteRecipe: 'Odstranit recept',
    mealPlanner: 'Plánovač jídel',
    appTitle: 'Počítadlo porcí jídel',
    mealNameLabel: 'Název jídla',
    totalMealWeightLabel: 'Celková hmotnost jídla (g)',
    portionCountLabel: 'Počet porcí',
    ingredientsTitle: 'Ingredience',
    addIngredient: '+ Přidat ingredienci',
    calculatePortions: 'Spočítat porce',
    saveRecipe: 'Uložit recept',
    newMeal: 'Nové jídlo',
    perPortionBreakdown: 'Rozpis na porci',
    ingredientChangesDetected: 'Změna ingrediencí',
    ingredientListChangedText: 'Seznam ingrediencí se změnil. Můžete ho uložit jako nový recept nebo přepsat existující recept.',
    newRecipeNameLabel: 'Nový název receptu',
    saveAsNewRecipe: 'Uložit jako nový recept',
    overwriteExistingRecipe: 'Přepsat existující recept',
    cancel: 'Zrušit',
    noValidIngredients: 'Žádné platné ingredience',
    noIngredientsMessage: 'Zadejte ingredience a počet porcí pro výpočet rozpisu.',
    readyMessage: 'Připraveno',
    emptyRecipeState: 'Přidejte recept a klikněte na “Spočítat porce”, aby se zobrazil rozpis.',
    noRecipesSaved: 'Ještě nebyly uloženy žádné recepty.',
    selectRecipe: 'Vyberte recept',
    portions: 'porcí',
    ingredients: 'ingrediencí',
    recipeNamePlaceholder: 'např. Kuřecí rýžový talíř',
    recipeCopyPlaceholder: 'Kopie receptu',
    pleaseNameMeal: 'Před uložením uveďte název jídla.',
    promptDeleteRecipe: 'Odstranit "{name}" z kuchařky?',
    selectRecipeToDelete: 'Nejprve vyberte recept k odstranění.',
    modalPrompt: 'Seznam ingrediencí receptu "{name}" se změnil. Chcete ho uložit jako nový recept nebo přepsat aktuální recept?',
    gramsPerPortion: '{value} g / porci',
    ingredientNameHint: 'Ingredience',
    ingredientWeightHint: 'Hmotnost (g)',
    port: 'porce',
    notAvailable: 'N/A',
  },
};

const appState = {
  cookbook: loadCookbook(),
  loadedRecipeId: null,
  loadedRecipeName: null,
  pendingConflict: null,
  language: loadLanguage(),
};

const ingredientList = document.getElementById('ingredientList');
const cookbookList = document.getElementById('cookbookList');
const recipeSelect = document.getElementById('recipeSelect');
const deleteRecipeBtn = document.getElementById('deleteRecipeBtn');
const resultList = document.getElementById('resultList');
const resultSummary = document.getElementById('resultSummary');
const mealNameInput = document.getElementById('mealName');
const mealWeightInput = document.getElementById('mealWeight');
const portionCountInput = document.getElementById('portionCount');
const modal = document.getElementById('recipeModal');
const newRecipeNameInput = document.getElementById('newRecipeName');
const modalText = document.getElementById('modalText');
const langButtons = document.querySelectorAll('.lang-btn');

function loadCookbook() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Unable to read cookbook from local storage:', error);
    return [];
  }
}

function loadLanguage() {
  try {
    const stored = localStorage.getItem(LANGUAGE_KEY);
    return stored === 'cs' ? 'cs' : 'en';
  } catch (error) {
    return 'en';
  }
}

function persistLanguage() {
  localStorage.setItem(LANGUAGE_KEY, appState.language);
}

function persistCookbook() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState.cookbook));
  renderCookbook();
}

function t(key, params = {}) {
  const locale = translations[appState.language] || translations.en;
  let value = locale[key] || translations.en[key] || key;

  Object.entries(params).forEach(([paramKey, paramValue]) => {
    value = String(value).replace(new RegExp(`\\{${paramKey}\\}`, 'g'), paramValue);
  });

  return value;
}

function applyLanguage() {
  document.documentElement.lang = appState.language;
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    if (key) {
      element.textContent = t(key);
    }
  });

  const currentLang = appState.language;
  langButtons.forEach((button) => {
    const isActive = button.dataset.lang === currentLang;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  const mealNamePlaceholder = t('recipeNamePlaceholder');
  mealNameInput.placeholder = mealNamePlaceholder;
  newRecipeNameInput.placeholder = t('recipeCopyPlaceholder');

  const ingredientInputs = document.querySelectorAll('#ingredientList input');
  ingredientInputs.forEach((input, index) => {
    const rowIndex = Math.floor(index / 2);
    const isName = index % 2 === 0;
    if (isName) {
      input.placeholder = t('ingredientNameHint');
    } else {
      input.placeholder = t('ingredientWeightHint');
    }
  });

  if (appState.loadedRecipeId) {
    const recipe = appState.cookbook.find((entry) => entry.id === appState.loadedRecipeId);
    if (recipe) {
      renderResults(recipe);
    }
  }

  renderCookbook();
}

function refreshResultsFromForm() {
  const recipe = buildRecipeFromForm();
  renderResults(recipe);
}

function makeIngredientRow(data = {}) {
  const row = document.createElement('div');
  row.className = 'ingredient-row';

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.placeholder = t('ingredientNameHint');
  nameInput.value = data.name || '';

  const weightInput = document.createElement('input');
  weightInput.type = 'number';
  weightInput.min = '0';
  weightInput.step = '0.1';
  weightInput.placeholder = t('ingredientWeightHint');
  weightInput.value = data.weight ?? '';

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'remove-row';
  removeBtn.textContent = appState.language === 'cs' ? 'Odstranit' : 'Remove';
  removeBtn.addEventListener('click', () => {
    if (ingredientList.children.length > 1) {
      row.remove();
      refreshResultsFromForm();
    }
  });

  nameInput.addEventListener('input', refreshResultsFromForm);
  weightInput.addEventListener('input', refreshResultsFromForm);

  row.appendChild(nameInput);
  row.appendChild(weightInput);
  row.appendChild(removeBtn);
  return row;
}

function addIngredientRow(data = {}) {
  ingredientList.appendChild(makeIngredientRow(data));
}

function resetIngredientRows(rows = 2) {
  ingredientList.innerHTML = '';
  for (let i = 0; i < rows; i += 1) {
    addIngredientRow();
  }
}

function buildRecipeFromForm() {
  const ingredients = Array.from(ingredientList.children)
    .map((row) => {
      const inputs = row.querySelectorAll('input');
      const name = inputs[0]?.value?.trim() || '';
      const weight = Number(inputs[1]?.value ?? 0);
      return {
        name,
        weight: Number.isFinite(weight) ? weight : 0,
      };
    })
    .filter((ingredient) => ingredient.name && ingredient.weight > 0);

  return {
    id: appState.loadedRecipeId || createId(),
    name: mealNameInput.value.trim(),
    totalWeight: Number(mealWeightInput.value) || 0,
    portions: Number(portionCountInput.value) || 0,
    ingredients,
  };
}

function createId() {
  return `recipe-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getIngredientNames(recipe) {
  return (recipe.ingredients || []).map((ingredient) => ingredient.name.trim().toLowerCase()).sort();
}

function ingredientNamesChanged(currentRecipe, existingRecipe) {
  const currentNames = getIngredientNames(currentRecipe);
  const existingNames = getIngredientNames(existingRecipe);
  return JSON.stringify(currentNames) !== JSON.stringify(existingNames);
}

function calculatePortionBreakdown(recipe) {
  if (!recipe || !Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
    return [];
  }

  const portions = Number(recipe.portions) || 1;
  if (portions <= 0) {
    return [];
  }

  return recipe.ingredients
    .filter((ingredient) => ingredient.name && Number(ingredient.weight) > 0)
    .map((ingredient) => ({
      name: ingredient.name,
      total: Number(ingredient.weight),
      perPortion: Number(ingredient.weight) / portions,
    }));
}

function renderResults(recipe) {
  const breakdown = calculatePortionBreakdown(recipe);

  if (!breakdown.length) {
    resultSummary.textContent = t('noValidIngredients');
    resultList.innerHTML = `<div class="empty-state">${t('noIngredientsMessage')}</div>`;
    return;
  }

  resultSummary.textContent = `${recipe.portions} ${t('portions')}`;
  resultList.innerHTML = breakdown
    .map(
      (ingredient) => `
        <div class="result-item">
          <span class="result-name">${escapeHtml(ingredient.name)}</span>
          <span class="result-amount">${t('gramsPerPortion', { value: formatNumber(ingredient.perPortion) })}</span>
        </div>
      `
    )
    .join('');
}

function renderCookbook() {
  const recipes = [...appState.cookbook].sort((a, b) => a.name.localeCompare(b.name));

  recipeSelect.innerHTML = `<option value="">${t('selectRecipe')}</option>` + recipes
    .map(
      (recipe) => `
        <option value="${encodeURIComponent(recipe.name)}" ${recipe.id === appState.loadedRecipeId ? 'selected' : ''}>
          ${escapeHtml(recipe.name)}
        </option>
      `
    )
    .join('');

  cookbookList.innerHTML = recipes.length
    ? recipes
        .map(
          (recipe) => `
            <li>
              <button type="button" class="${recipe.id === appState.loadedRecipeId ? 'is-active' : ''}" data-recipe-id="${recipe.id}">
                <span class="recipe-name">${escapeHtml(recipe.name)}</span>
                <span class="recipe-meta">${recipe.portions} ${t('portions')} · ${recipe.ingredients.length} ${t('ingredients')}</span>
              </button>
            </li>
          `
        )
        .join('')
    : `<li><div class="empty-state">${t('noRecipesSaved')}</div></li>`;

  cookbookList.querySelectorAll('button[data-recipe-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const recipe = appState.cookbook.find((entry) => entry.id === button.dataset.recipeId);
      if (recipe) {
        loadRecipeIntoForm(recipe);
      }
    });
  });
}

function loadRecipeIntoForm(recipe) {
  appState.loadedRecipeId = recipe.id;
  appState.loadedRecipeName = recipe.name;
  mealNameInput.value = recipe.name;
  mealWeightInput.value = recipe.totalWeight || '';
  portionCountInput.value = recipe.portions || '';

  ingredientList.innerHTML = '';
  (recipe.ingredients || []).forEach((ingredient) => {
    addIngredientRow({ name: ingredient.name, weight: ingredient.weight });
  });

  if (!recipe.ingredients || recipe.ingredients.length === 0) {
    resetIngredientRows(1);
  }

  renderCookbook();
  renderResults(recipe);
}

function resetForm() {
  appState.loadedRecipeId = null;
  appState.loadedRecipeName = null;
  mealNameInput.value = '';
  mealWeightInput.value = '';
  portionCountInput.value = '';
  resetIngredientRows(2);
  renderCookbook();
  resultSummary.textContent = t('readyMessage');
  resultList.innerHTML = `<div class="empty-state">${t('emptyRecipeState')}</div>`;
}

function formatNumber(value) {
  const locale = appState.language === 'cs' ? 'cs-CZ' : 'en-US';
  return Number(value).toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function openConflictModal(existingRecipe, editedRecipe) {
  appState.pendingConflict = { existingRecipe, editedRecipe };
  modalText.textContent = t('modalPrompt', { name: existingRecipe.name });
  newRecipeNameInput.value = `${editedRecipe.name || existingRecipe.name} ${appState.language === 'cs' ? 'kopie' : 'copy'}`;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function closeConflictModal() {
  appState.pendingConflict = null;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}

function saveRecipeToCookbook(recipe) {
  const cleanedRecipe = {
    ...recipe,
    name: recipe.name.trim(),
    ingredients: recipe.ingredients.map((ingredient) => ({
      name: ingredient.name.trim(),
      weight: Number(ingredient.weight),
    })),
  };

  if (!cleanedRecipe.name) {
    alert(t('pleaseNameMeal'));
    return;
  }

  const existingByName = appState.cookbook.find((entry) => entry.name.toLowerCase() === cleanedRecipe.name.toLowerCase());

  if (appState.loadedRecipeId && appState.loadedRecipeName && existingByName && existingByName.id !== appState.loadedRecipeId) {
    openConflictModal(existingByName, cleanedRecipe);
    return;
  }

  if (appState.loadedRecipeId) {
    const index = appState.cookbook.findIndex((entry) => entry.id === appState.loadedRecipeId);
    if (index >= 0) {
      const existingRecipe = appState.cookbook[index];
      const namesChanged = ingredientNamesChanged(cleanedRecipe, existingRecipe);

      if (namesChanged) {
        openConflictModal(existingRecipe, cleanedRecipe);
        return;
      }

      const updatedRecipe = {
        ...existingRecipe,
        ...cleanedRecipe,
        id: existingRecipe.id,
        name: existingRecipe.name,
      };

      appState.cookbook[index] = updatedRecipe;
      appState.loadedRecipeId = updatedRecipe.id;
      appState.loadedRecipeName = updatedRecipe.name;
      persistCookbook();
      renderResults(updatedRecipe);
      return;
    }
  }

  if (existingByName && !appState.loadedRecipeId) {
    openConflictModal(existingByName, cleanedRecipe);
    return;
  }

  const recipeToSave = {
    ...cleanedRecipe,
    id: cleanedRecipe.id || createId(),
  };

  appState.cookbook.push(recipeToSave);
  appState.loadedRecipeId = recipeToSave.id;
  appState.loadedRecipeName = recipeToSave.name;
  persistCookbook();
  renderResults(recipeToSave);
}

function handleSaveAsNew() {
  if (!appState.pendingConflict) {
    return;
  }

  const { editedRecipe } = appState.pendingConflict;
  const requestedName = newRecipeNameInput.value.trim();
  const finalName = requestedName || `${editedRecipe.name || 'Recipe'} copy`;

  const recipeToSave = {
    ...editedRecipe,
    id: createId(),
    name: finalName,
  };

  appState.cookbook.push(recipeToSave);
  appState.loadedRecipeId = recipeToSave.id;
  appState.loadedRecipeName = recipeToSave.name;
  persistCookbook();
  loadRecipeIntoForm(recipeToSave);
  closeConflictModal();
}

function handleOverwriteExisting() {
  if (!appState.pendingConflict) {
    return;
  }

  const { existingRecipe, editedRecipe } = appState.pendingConflict;
  const index = appState.cookbook.findIndex((entry) => entry.id === existingRecipe.id);

  if (index >= 0) {
    const updatedRecipe = {
      ...existingRecipe,
      ...editedRecipe,
      id: existingRecipe.id,
      name: existingRecipe.name,
    };

    appState.cookbook[index] = updatedRecipe;
    appState.loadedRecipeId = updatedRecipe.id;
    appState.loadedRecipeName = updatedRecipe.name;
    appState.cookbook = [...appState.cookbook];
    persistCookbook();
    renderResults(updatedRecipe);
  }

  closeConflictModal();
}

function calculateAndDisplay() {
  const recipe = buildRecipeFromForm();
  renderResults(recipe);
}

document.getElementById('addIngredientBtn').addEventListener('click', () => {
  addIngredientRow();
  refreshResultsFromForm();
});

[mealNameInput, mealWeightInput, portionCountInput].forEach((field) => {
  field.addEventListener('input', refreshResultsFromForm);
  field.addEventListener('change', refreshResultsFromForm);
});

ingredientList.addEventListener('input', refreshResultsFromForm);

document.getElementById('calculateBtn').addEventListener('click', calculateAndDisplay);

document.getElementById('saveRecipeBtn').addEventListener('click', () => {
  const recipe = buildRecipeFromForm();
  saveRecipeToCookbook(recipe);
});

document.getElementById('newMealBtn').addEventListener('click', resetForm);

document.getElementById('loadRecipeBtn').addEventListener('click', () => {
  const selectedName = recipeSelect.value;
  if (!selectedName) {
    return;
  }

  const recipe = appState.cookbook.find((entry) => entry.name === decodeURIComponent(selectedName));
  if (recipe) {
    loadRecipeIntoForm(recipe);
  }
});

deleteRecipeBtn.addEventListener('click', () => {
  const selectedName = recipeSelect.value;
  if (!selectedName) {
    alert(t('selectRecipeToDelete'));
    return;
  }

  const recipe = appState.cookbook.find((entry) => entry.name === decodeURIComponent(selectedName));
  if (!recipe) {
    return;
  }

  const confirmed = window.confirm(t('promptDeleteRecipe', { name: recipe.name }));
  if (!confirmed) {
    return;
  }

  appState.cookbook = appState.cookbook.filter((entry) => entry.id !== recipe.id);
  appState.loadedRecipeId = null;
  appState.loadedRecipeName = null;
  persistCookbook();
  resetForm();
});

langButtons.forEach((button) => {
  button.addEventListener('click', () => {
    appState.language = button.dataset.lang;
    persistLanguage();
    applyLanguage();
  });
});

document.getElementById('saveAsNewBtn').addEventListener('click', handleSaveAsNew);
document.getElementById('overwriteBtn').addEventListener('click', handleOverwriteExisting);
document.getElementById('cancelModalBtn').addEventListener('click', closeConflictModal);

resetIngredientRows(2);
applyLanguage();
resultList.innerHTML = `<div class="empty-state">${t('emptyRecipeState')}</div>`;
