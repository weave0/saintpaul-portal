# Type Safety Plan

This document outlines a phased strategy to introduce stronger type safety into the Saint Paul backend without disrupting current velocity.

## Phase 0 (Completed)

- Establish ESLint baseline and consistent schema validation.
- JSDoc annotations for complex model structures.

## Phase 1: Incremental JSDoc

- Add `@typedef` blocks for BuildingSpec subdocuments (Dimensions, Height, Material, Roof).
- Annotate route handlers with param/return descriptions.
- Introduce a lightweight `types.js` exporting shared JSDoc typedefs.
- Configure VS Code to enforce `checkJs` for `utils/` and `middleware/` folders.

## Phase 2: Partial TypeScript Migration

- Create `tsconfig.json` with `allowJs` and `declaration` to produce `.d.ts` for JS modules.
- Migrate new modules (`metrics`, caching utilities) to `.ts` first.
- Add build step: `npm run build:ts` (tsc emit only) – no bundling.

## Phase 3: Core Models & Routes to TS

- Convert Mongoose models and route files gradually.
- Replace CommonJS `require` with ES Modules imports as files migrate.
- Introduce stricter compiler options (`strictNullChecks`, `noImplicitAny`).

## Phase 4: Frontend Alignment (Optional)

- Share OpenAPI-generated types (using `openapi-typescript`) between backend & frontend.
- Replace ad-hoc response handling with typed API client wrappers.

## Tooling

- Add `typescript`, `@types/express`, `@types/node` when starting Phase 2.
- Consider `ts-node` for developer ergonomics (not required for production if still running JS output).

## Success Metrics

- Reduction in runtime type errors reported.
- Improved IDE autocomplete accuracy for route handlers and model properties.
- Ability to safely refactor diff logic & pagination without regressions.

## Rollback Strategy

- If TypeScript overhead slows delivery, freeze at Phase 1 (JSDoc) which still offers strong IntelliSense without compilation cost.

## Immediate Next Steps

1. Create `types.js` with JSDoc typedefs.
2. Annotate `reconstructions.js` diff logic return structure.
3. Add `// @ts-check` to `utils/diffCache.js` after introducing typedefs.

---
Maintaining incremental adoption prevents large disruptive rewrites while steadily increasing confidence and maintainability.
