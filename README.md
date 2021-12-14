# Règles

-   Un `utilisateur` a seulement accès aux autres utilisateurs de son organisation
-   Un `utilisateur` n'a accès qu'aux dashboards dans lesquels il est collaborateur ou propriétaire

-   Un `collaborateur` d'un dashboard peut modifier la description d'un dashboard (mais pas son titre)
-   Un `collaborateur` peut quitter un dashboard (plus d'accès)

-   Un `owner` d'un dashboard peut tout modifier sur un dashboard (dont son titre)
-   Un `owner` d'un dashboard peut ajouter / supprimer un dashboard
-   Un `owner` d'un dashboard peut le supprimer

# Démarche de tests

-   Avec l'utilisateur `olympe`, créer un dashboard `Dashtmp`
-   Avec l'utilisateur `olympe`, vérifier que l'utilisateur peut voir le dashboard `Dashtmp`

-   Avec l'utilisateur `victor`, vérifier que l'utilisateur ne peut **pas** voir le dashboard `Dashtmp`

-   Avec l'utilisateur `olympe`, modifier le nom du dashboard `Dashtmp` en `Dash1` (devrait marcher)
-   Avec l'utilisateur `olympe`, ajouter `victor` en tant que collaborateur

-   Avec l'utilisateur `victor`, vérifier que l'utilisateur peut voir le dashboard `Dash1`
-   Avec l'utilisateur `victor`, modifier le nom du dashboard `Dash1` en `foo` (ne devrait pas marcher)
-   Avec l'utilisateur `victor`, modifier la description du dashboard `Dash1` en `foo` (**devrait** marcher)
-   Avec l'utilisateur `victor`, essayer de supprimer le dashboard `Dash1` (ne devrait pas marcher)
-   Avec l'utilisateur `victor`, essayer de revoke les droits d'`olympe` (ne devrait pas marcher)

-   Avec l'utilisateur `olympe`, supprimer le dashboard `Dash1`
-   Vérifier que les deux utilisateurs `olympe` et `victor` n'aient plus de droits concernant le dashboard `Dash1`
