import { definePlugin } from "@utils/types";
import { Webpack } from "@webpack";

const PlatformModule = Webpack.findByProps("getPlatform", "PlatformInfo");

export default definePlugin({
    name: "MobileIndicatoriOS",
    description: "Spoofs your desktop client session property to display an iOS mobile indicator.",
    authors: [{ name: "Community Peer", id: 1234567890n }],
    
    start() {
        if (PlatformModule?.PlatformInfo) {
            this.originalPlatform = PlatformModule.PlatformInfo.os;
            PlatformModule.PlatformInfo.os = "Discord iOS"; 
        }
    },
    
    stop() {
        if (PlatformModule?.PlatformInfo && this.originalPlatform) {
            PlatformModule.PlatformInfo.os = this.originalPlatform;
        }
    }
});