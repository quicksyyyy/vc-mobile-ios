import definePlugin, { OptionType } from "@utils/types";
import { findByProps } from "@webpack";
import { Forms } from "@webpack/common";

// Correctly resolving the platform identification module via direct extraction
const PlatformModule = findByProps("getPlatform", "PlatformInfo");

export default definePlugin({
    name: "MobilePlatformSpoof",
    description: "Spoof your platform string. Open settings to select between iOS and Android.",
    authors: [{ name: "Community Peer", id: 1234567890n }],

    options: {
        useiOS: {
            type: OptionType.BOOLEAN,
            description: "Toggle on for iOS, toggle off for Android status",
            default: true,
            restartNeeded: true 
        }
    },

    start({ pluginOptions }) {
        if (PlatformModule?.PlatformInfo) {
            this.originalPlatform = PlatformModule.PlatformInfo.os;

            // Dynamically assign client identity properties based on user options configuration
            const targetOS = pluginOptions.useiOS.get() ? "Discord iOS" : "Discord Android";
            PlatformModule.PlatformInfo.os = targetOS; 
        }
    },

    stop() {
        if (PlatformModule?.PlatformInfo && this.originalPlatform) {
            PlatformModule.PlatformInfo.os = this.originalPlatform;
        }
    },

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
