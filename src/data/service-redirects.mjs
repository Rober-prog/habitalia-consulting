import legacy from '../content/services.json' with { type: 'json' };
import categories from '../content/categories.json' with { type: 'json' };

export const legacyCategory = {
  construction: 'direction',
  management: 'direction',
  safety: 'safety',
};
export const isRedirectedLegacy = (id) => Object.hasOwn(legacyCategory, id);
// The remaining old draft URLs lead to the catalogue without asserting a new
// category equivalence or publishing unconfirmed service descriptions.
export const catalogRedirects = legacy
  .filter((item) => !isRedirectedLegacy(item.id))
  .flatMap((item) =>
    ['ca', 'es'].map((lang) => {
      const root = lang === 'ca' ? 'serveis' : 'servicios';
      return {
        from: `/${lang}/${root}/${item.slug[lang]}/`,
        to: `/${lang}/${root}/`,
        status: 302,
      };
    }),
  );
export const serviceRedirects = legacy
  .filter((item) => isRedirectedLegacy(item.id))
  .flatMap((item) => {
    const category = categories.find(
      (entry) => entry.id === legacyCategory[item.id],
    );
    if (!category)
      throw new Error(`Missing redirect destination for ${item.id}`);
    return ['ca', 'es'].map((lang) => {
      const root = lang === 'ca' ? 'serveis' : 'servicios';
      return {
        from: `/${lang}/${root}/${item.slug[lang]}/`,
        to: `/${lang}/${root}/${category.slug[lang]}/`,
        status: 301,
      };
    });
  });
export const allRedirects = [...serviceRedirects, ...catalogRedirects];
