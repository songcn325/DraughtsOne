# GitHub Handoff

Recommended first GitHub upload:

```bash
cd draughtsone
git init
git add .
git commit -m "Scaffold DraughtsOne MVP architecture"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

Recommended team review order:

1. `README.md`
2. `docs/architecture.md`
3. `docs/frontend-backend-contract.md`
4. `docs/api.md`
5. `packages/shared/src/index.ts`
6. `apps/web/src/pages`
7. `apps/server/src/realtime/socket.ts`
8. `apps/server/prisma/schema.prisma`

