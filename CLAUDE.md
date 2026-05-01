# CLAUDE.md — roomler (legacy)

Nuxt 2 SSR chat/collaboration app. Live at `https://roomler.live/`. The newer **Roomler AI** (Rust + Vue 3) lives at `/home/gjovanov/roomler-ai/` — don't confuse.

## Deployment

Deployment configuration lives in `gjovanov/roomler-deploy` (the legacy Ansible repo, now extended with Kustomize). Kustomize manifests under `k8s/base/` + `k8s/overlays/prod/` alongside the original `playbooks/` and `roles/`.

**GitOps**: ArgoCD at [argocd.roomler.ai](https://argocd.roomler.ai) reconciles the `roomler-old` Application from `github.com/gjovanov/roomler-deploy @ main` path `k8s/overlays/prod`. Sync policy is **Manual** — trigger via `argocd app sync roomler-old` or the UI.

Namespace is `roomler` (not `roomler-old` — the ArgoCD name is different from the K8s namespace). Pod runs on `k8s-worker-1` (mars), NodePort 30030.

**Images**: currently `gjovanov/roomler:latest` + `gjovanov/janus-slim:latest`, both with `imagePullPolicy: Never` (loaded locally via `ctr import`). Registry migration is pending — see `roomler-deploy/k8s/overlays/prod/kustomization.yaml` for the follow-up recipe.

**Secrets**: `roomler-secret` and `mongodb-secret` are sealed via Bitnami SealedSecrets and committed to git under `roomler-deploy/k8s/base/sealed/`.

**PVCs**: `mongodb-data` and `roomler-uploads` are NOT managed by ArgoCD — provisioned imperatively.

### Deployment Workflow (structural changes)

```bash
cd /home/gjovanov/roomler-deploy
# edit k8s/base/** or k8s/overlays/prod/**
git commit -am "chore(k8s): <description>"
git push
argocd app sync roomler-old --grpc-web
```

### Status

This is a legacy deployment retained alongside the new Roomler AI. No active
feature development expected. When sunsetting, scale down via ArgoCD and
archive the namespace.

## K8s deployment placement

Cluster has three zones via `topology.kubernetes.io/zone`: `mars`,
`zeus`, `jupiter` (one master + one worker VM per bare-metal host).
Apps are split by tier (added 2026-05-01 after a mars-host overload
incident):

  - `tier=high-performance` (zeus + jupiter workers): this app, plus
    roomler / roomler-ai / oxmux / lgr / purestat / tickytack / clawui
    (when migrated to K8s).
  - `tier=utility` (mars worker): bauleiter, regal, monitoring stack,
    docker registry, image builds.

Enforced via a Kustomize patch in `roomler-deploy/k8s/overlays/prod/
kustomization.yaml` that puts a required `nodeAffinity` on every
Deployment + StatefulSet. Hostname pins in `base/` are retained where
the StatefulSet PVC uses node-local storage; the tier requirement is
an *additional* constraint — both must match.
