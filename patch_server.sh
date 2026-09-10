#!/bin/bash
sed -i '/function safeExtractJson/i \
function generateMinimalRbxlx(files: Record<string, any>): string {\
  let referentCounter = 0;\
  const getRef = () => `RBX${referentCounter++}`;\
  const containers: Record<string, string> = {\
    Workspace: "",\
    ReplicatedStorage: "",\
    ServerScriptService: "",\
    StarterPlayer: "",\
    StarterGui: ""\
  };\
  if (files) {\
    Object.values(files).forEach(file => {\
      if (!file.path || !file.content) return;\
      const parts = file.path.split("/");\
      const root = parts[0];\
      let className = "ModuleScript";\
      if (file.name.includes(".server.")) className = "Script";\
      else if (file.name.includes(".client.")) className = "LocalScript";\
      const safeContent = file.content.replace(/]]>/g, "]]]]><![CDATA[>");\
      const xmlNode = `\n        <Item class="${className}" referent="${getRef()}">\n          <Properties>\n            <string name="Name">${file.name.replace(/\.(server|client)?\.lua$/, "")}</string>\n            <ProtectedString name="Source"><![CDATA[${safeContent}]]></ProtectedString>\n          </Properties>\n        </Item>`;\
      if (containers[root] !== undefined) {\
        containers[root] += xmlNode;\
      } else {\
        containers.ServerScriptService += xmlNode;\
      }\
    });\
  }\
  return `<?xml version="1.0" encoding="utf-8"?>\n<roblox xmlns:xmime="http://www.w3.org/2005/05/xmlmime" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.roblox.com/roblox.xsd" version="4">\n  <External>null</External>\n  <External>nil</External>\n  <Item class="Workspace" referent="${getRef()}">\n    <Properties>\n      <string name="Name">Workspace</string>\n    </Properties>\n    ${containers.Workspace}\n  </Item>\n  <Item class="ReplicatedStorage" referent="${getRef()}">\n    <Properties>\n      <string name="Name">ReplicatedStorage</string>\n    </Properties>\n    ${containers.ReplicatedStorage}\n  </Item>\n  <Item class="ServerScriptService" referent="${getRef()}">\n    <Properties>\n      <string name="Name">ServerScriptService</string>\n    </Properties>\n    ${containers.ServerScriptService}\n  </Item>\n  <Item class="StarterPlayer" referent="${getRef()}">\n    <Properties>\n      <string name="Name">StarterPlayer</string>\n    </Properties>\n    <Item class="StarterPlayerScripts" referent="${getRef()}">\n      <Properties>\n        <string name="Name">StarterPlayerScripts</string>\n      </Properties>\n      ${containers.StarterPlayer}\n    </Item>\n  </Item>\n  <Item class="StarterGui" referent="${getRef()}">\n    <Properties>\n      <string name="Name">StarterGui</string>\n    </Properties>\n    ${containers.StarterGui}\n  </Item>\n</roblox>`;\
}\
' server.ts
