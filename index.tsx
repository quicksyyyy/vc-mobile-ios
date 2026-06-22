import { definePlugin, OptionType } from "@utils/types";
import { Webpack } from "@webpack";
import { Forms } from "@webpack/common";

const PlatformModule = Webpack.findByProps("getPlatform", "PlatformInfo");

export default definePlugin({
    name: "MobilePlatformSpoof",
    description: "Spoof your platform string. Open settings to select between iOS and Android.",
    authors: [{ name: "Community Peer", id: 1234567890n }],

    // 1. Define the configurable settings panel schema
    options: {
        useiOS: {
            type: OptionType.BOOLEAN,
            description: "Toggle on for iOS, toggle off for Android status",
            default: true,
            restartNeeded: true // Requires a client reload to send the updated handshake packet
        }
    },

    start({ pluginOptions }) {
        if (PlatformModule?.PlatformInfo) {
            this.originalPlatform = PlatformModule.PlatformInfo.os;

            // 2. Read user choice from the options store dynamically
            const targetOS = pluginOptions.useiOS.get() ? "Discord iOS" : "Discord Android";
            PlatformModule.PlatformInfo.os = targetOS; 
        }
    },

    stop() {
        if (PlatformModule?.PlatformInfo && this.originalPlatform) {
            PlatformModule.PlatformInfo.os = this.originalPlatform;
        }
    },

    // 3. Render the UI elements within Vencord's core configuration system
    settingsPanel: ({ settings }) => (
        <>
            <Forms.FormSwitch
                title="Use Apple iOS Status"
                note="When enabled, you will appear with an iOS device indicator. When disabled, you will appear as an Android device."
                value={settings.useiOS}
                onChange={(checked) => {
                    settings.useiOS = checked;
                }}
            />
        </>
    )
});
