# Claude iOS 逆向与地区风控综合报告

样本版本 1.261019.20　分析日期 2026年10月22日

## 阅读结论

这份 IPA 包含原生 Swift 客户端、五个系统扩展，以及语音、Claude Code、MCP Apps、可信设备注册和银行连接等模块。地区风控方面，公开资料直接确认了 IP 国家或地区判断；包内还能观察到商店地区、系统定位、设备绑定、App Attest 和 Sift 依赖等线索。

**当前不能认定某个客户端信号直接导致封号。** 主业务代码带 FairPlay 加密，本次没有运行应用、抓取网络请求或获得服务端决策记录。本文的 TOP20 是后续调查优先级，综合考虑证据直接程度、地区相关性和关联能力，不是封号概率、危险程度或触发阈值排名。

报告用于了解可能参与地区与账号风险判断的机制，不把中国国籍、中文输入或中国型号手机视为已经证实的触发条件。

## 样本与分析范围

| 项目 | 观察结果 |
|---|---|
| 应用 | Claude iOS |
| Bundle ID | com.anthropic.claude |
| 版本与 Build | 1.261019.20 / 39361214947 |
| 目标平台 | arm64，iPhone 与 iPad，最低 iOS 18.0 |
| IPA 大小 | 175946422 字节，约 167.8 MiB |
| 主程序大小 | 125167552 字节，约 119.4 MiB |
| 主要工具 | REA 6.7.0，Mach-O 与 plist 解析，签名读取，objdump，Swift demangle |
| 本次操作 | 静态解析与资源检查，原始 IPA 未修改 |

IPA SHA-256：

`09739f2ee6122040800c6e7b6d7098d0ffe673c312548b0ebc21c9e76532869e`

主程序 SHA-256：

`479536c0f4cd14fd223dad99ca004c16cb8f33ef0b727467d54398b470ee4894`

主程序、五个扩展和 LinkKit 均标记 cryptid 为 1。主程序加密区为文件偏移 [0x4000, 0x6804000)，共 104 MiB，覆盖函数体、普通字符串、Objective-C 名称和 Swift 反射数据。该限制阻止了可信的业务函数反编译与完整调用图恢复。

主程序的 __oslogstring 位于加密范围之后，文件偏移 0x6804000，大小 30733 字节，从中恢复 594 条静态日志模板。主程序还保留 10559 条未定义外部符号，支持分析依赖和 API 能力。日志模板不是运行日志，导入符号也不代表恢复出了对应的业务函数。

## 证据等级与政策边界

| 等级 | 含义 | 可以支持的结论 |
|---|---|---|
| A | 官方明确确认用途 | Anthropic 公布的地区或安全处理方式 |
| B | 包内存在静态线索 | API、配置、资源、模板或依赖清单存在；不保证启用或用于风控 |
| C | 服务端工作假设 | 技术上可能结合的规则；本次没有直接证据 |

B 级内部强弱不同。多个模板与签名声明交叉支持，比单独的 SDK 许可证条目更直接。SDK 官方文档只说明产品能力，不代表 Claude 已启用全部能力。C 级因素不应写成已发现的封禁规则。

截至本次核查，中国大陆未列在 Claude 官方支持地点清单；官方账号帮助页将从不受支持地点创建账号列为可能停用的原因。现有资料不支持把这一规则直接扩展为所有中国国籍个人无论所在地都被禁止，也不支持一旦访问就必然立即停用。[S1][S2]

Anthropic 的位置隐私说明明确区分产品功能位置和安全位置处理：安全及反滥用用途会利用 IP 与其他信号推断国家或地区，而且不能通过隐私开关关闭。[S3]

## TOP20 候选风险因素

下表按调查优先级排列。设备凭据失效、支付失败和网络失败均可能是普通故障，不能直接等同账号停用。

| 排名 | 候选因素与等级 | 证据和可能联系 | 尚未验证的关键点 |
|---|---|---|---|
| 1 | IP 国家或地区 A | 官方明确用于地区合规、安全与反滥用判断。[S3] | IP 库、更新频率、阈值及某次停用原因未知。 |
| 2 | Sift 反欺诈信号 B | OSS 清单列 sift-ios；cydia 查询配置与其集成建议吻合。 | 许可证不证明初始化、实际上传或参与封号。 |
| 3 | 可信设备 ID 与 token B | 注册模板有 deviceId，另有 token 被拒和重新注册模板。 | 与账号历史的关联方式、保留期未知。 |
| 4 | App Attest 可信性 B | production entitlement、DCAppAttestService 与 assertion 模板交叉支持。 | 校验覆盖和失败处置未知；它不直接证明所在地。 |
| 5 | App Store 商店地区 B | 导入 Storefront.current 与 countryCode，可引用商店国家或地区。[S4] | 是否读取、上传或用于地区规则未知。 |
| 6 | 系统定位与地理编码 B | CLLocationManager、CLGeocoder、权限说明及定位模板存在。 | 是否获授权、取得位置并用于风控未知。 |
| 7 | 设备绑定密钥与轮换 B | deviceBindingKid、reattestKid、rotation 和 heal 模板存在。 | 签名覆盖、关联范围、轮换阈值未知。 |
| 8 | Keychain 与 Cookie 会话关联 B | Keychain CRUD、共享组、CookieStorage 和 WebKit 网站存储存在。 | 不能认定永久追踪或跨重装、跨账号关联。 |
| 9 | DeviceCheck 设备状态 B | DCDevice 导入；系统服务支持少量设备状态。[S6] | 未证明 Claude 实际读写了哪些标记。 |
| 10 | 代理出口类型与 IP 信誉 C | 官方使用 IP 和其他信号，但未公开此项具体规则。 | ASN、机房或住宅分类、信誉供应商均未恢复。 |
| 11 | 登录地点与 IP 频繁变化 C | 请求历史在服务端可形成时间序列。 | 未发现地区跳变规则、速度阈值或权重。 |
| 12 | 多来源地区信号不一致 C | 包内有 IP 之外的地区信息能力，存在组合判断的可能。 | 未恢复 IP、商店、位置、时区的比对逻辑。 |
| 13 | 同设备关联多个账号 C | 设备注册机制提供关联基础。 | 未证明存在跨账号关联、数量阈值或处罚规则。 |
| 14 | 同账号多设备与并发会话 C | 包内有 account、session、device 与跨设备刷新线索。 | 多设备是正常功能，异常并发判定未知。 |
| 15 | 系统地区与语言 B | Locale.current、CountryCode、LanguageCode 引用存在。 | 本地化也依赖这些 API；未证明中文触发规则。 |
| 16 | 系统时区 B | TimeZone.current 与 NSTimeZone 引用存在。 | 日历等正常功能需要时区，风控用途未知。 |
| 17 | SIM 与运营商地区线索 B | CTCarrier、CTTelephonyNetworkInfo 导入存在。 | 是否成功读取有效值、上传或使用未知。 |
| 18 | 应用完整性与越狱环境 B | App Attest、签名信息和 cydia 查询项存在。 | 未恢复完整越狱检测或重签名处罚逻辑。 |
| 19 | 购买记录与账号关联 B | Transaction 的 originalID、appAccountToken、环境与撤销状态导入存在。 | 可能仅用于订阅验证，未证明关联地区封禁。 |
| 20 | 注册及支付资料的地区一致性 C | 登录与计费模块存在；后端可能拥有注册和交易信息。 | 手机号、账单国家、付款资料及规则未恢复。 |

## 三个容易误读的机制

### App Store 商店地区

Storefront.current 获取当前 App Store 商店信息，可能返回空值；Storefront.countryCode 读取商店的三字母国家或地区代码，例如 USA、CHN、JPN。它们不提供完整 Apple ID、密码、国籍或实际 GPS 位置。[S4]

商店地区与实际所在地可以不同。本次新增确认的是这两个 API 的导入引用，不是它们已执行、已上传或已经被用于账号停用。其符号字符串文件偏移分别为 121837716 和 121837673，可在补充 JSON 中复查。

### App Attest 与可信设备注册

Apple App Attest 用于验证合法应用实例及后续 assertion。[S5] 样本中的 deviceId、deviceBindingKid、reattestKid 和 trusted-device token 模板支持设备注册与异常恢复设计。它们不直接说明设备位于中国，也不等同识别中国型号手机或 Apple ID 国区。

关键模板包括主程序文件偏移 0x68050a0 的注册结果、0x6805140 的 token 被拒与状态重置，以及 0x6805190 的 kid_not_found。凭据失败可能是普通认证问题，不能单凭这些模板认定发生封号。

### Sift 集成线索

随包 OSS 清单记录 sift-ios，revision 为 0eda179a11a781c3b217402a10acbc89fc6043f4。主 Info.plist 的 LSApplicationQueriesSchemes 含 cydia。Sift 官方集成文档介绍设备属性、应用生命周期、用户 ID 关联、位置采集配置，并推荐 cydia 查询配置辅助检查 Cydia。[S7]

这些线索说明 Sift 是值得重点验证的方向。尚未恢复其初始化、Beacon 配置、位置采集开关、发送内容或服务端决策。当前 SDK 文档不能替代对样本 revision 的行为验证。

## 其他候选信号与解读边界

未进入 TOP20 的线索包括 Wi-Fi 或蜂窝网络类型、设备型号与系统信息、应用版本、FCM 推送 token、电量或屏幕状态，以及 Datadog、Firebase、GoogleAppMeasurement、Sentry、Google App Check 等组件。它们的风控用途证据弱，很多都有正常产品或诊断用途。

其他纯服务端假设包括共享出口的大量账号、历史滥用记录、批量注册、自动化频率、异常退款或拒付、组织风险记录。这些没有在包内恢复出直接规则，不能作为已发现机制报告。

以下判断尤其缺乏证据：中文输入就会封号；国行 iPhone 必然暴露中国国籍；代理配置 API 可以穿透代理取得真实 IP；Keychain 或推送 token 一定是永久硬件标识；任意 App Attest 失败都会停用账号。

## 其他主要逆向发现

客户端有大量 SwiftUI、UIKit、Combine 与 Swift concurrency 导入；网络栈包含 URLSession 流式 API 与 WebSocket，嵌入内容包含 WebKit。普通聊天的精确协议与完整 API 请求体尚未恢复，不能仅由流式 API 断言全部链路采用 SSE。

| 模块 | 较明确的静态发现 | 实际状态边界 |
|---|---|---|
| 语音 | STT、TTS WebSocket、音频引擎、keepalive、AEC 状态模板 | 编解码、地址和运行行为未知 |
| Claude Code 与远程会话 | sessions/watch、自托管 runner、项目、diff、GitHub routine、cowork-remote 模板 | 服务器协议与账户开放范围未知 |
| MCP Apps | 初始化、JSON-RPC、OAuth、sandbox proxy、传感器权限与上下文限制模板 | 校验有效性与沙箱覆盖未测试 |
| 银行连接 | SunnyPuddle 正文描述 Plaid、余额历史、扩展权限与重连；打包 LinkKit | 不证明上线或已读取银行数据 |
| CarPlay | Scene manifest、签名 entitlement、设置正文和连接模板 | 未实机验证 |
| 系统工具 | 日历与提醒 CRUD、位置、Health 读取、AlarmKit 及通知回退模板 | 权限是否授予、调用是否发生未知 |

五个扩展分别为 WidgetExtension、ShareExtension、ClaudeNotificationService、CCRNotificationContent 和 LockedCameraCaptureExtension。Widget 的共享 Keychain 声明与 direct fetch 模板相符，但没有独立路由或 IP 泄露的运行证据。

Payload 按扩展名枚举未发现独立 JS、HTML、HTM 或 CSS 文件；不能排除二进制内嵌或远端加载。McpApps 资源仅含配置与占位 README，GrowthBookConfigOverrides 仅含占位文件，因此未恢复网页源代码或生效开关值。

## 尚未解决的问题

本次已经回答样本身份、结构、加密范围、主要 API 能力和资源内容；模块实现、地区数据的实际读取与上传仅部分可解释。

仍未解决：完整风控请求字段；Sift 和 App Check 初始化；实际设备与账号关联策略；地区比对逻辑；服务端阈值；某次账号停用的真实原因；功能灰度范围；安全检查是否正确有效。

若继续调查，最有价值的输入是同版本合法取得的未加密开发包或解密 Mach-O、明确授权的测试设备运行证据，或者实际停用通知和服务端响应。主程序业务代码仍加密的情况下，当前报告不声称完成这些验证。

## 证据索引

| 文件 | 内容 |
|---|---|
| rea-evidence.json | 18 条 REA Evidence，含包清单、提取、主 Mach-O、签名、plist、符号表 |
| macho-static.json | 8 个 Mach-O 的哈希、加密边界、section、符号与文件偏移 |
| oslog-strings.json | 594 条主程序日志模板与文件偏移 |
| region-risk-static-evidence.json | Sift 条目、cydia 配置、停用文案与地区相关导入 |
| claude-resource-findings.json | 文件枚举、资源正文、App Intents、隐私清单与 OSS revision |
| claude-extension-entitlements.json | 扩展签名工具警告、直接恢复的 XML entitlement、偏移和哈希 |
| deliverable-sha256.json | 本次交付文件的 SHA-256 索引 |

主要 REA Evidence：

- 主 Mach-O：ev_79eaa9bc6759e548bada81c6e56dac15e65fb1d1596ab125e3bd2a596169479f
- 主签名：ev_c1ad32cdebd5f7bd69ffce77ee04a8eaa232fc09f2f55f2779f710154289d43e
- 主 Info.plist：ev_ed6564080d44ca863cf7b4d34caebe7a10da9102470cb4c862506256f97f4de2
- 完整符号表：ev_9f62492e019030ff875d3612ad1bc2f7cec08070c41105ca0b2099ead0bf43bf

签名读取没有验证整个分发来源或完整信任链。五个扩展的主机 codesign 曾给出 entitlements blob 警告，后续直接解析恢复 XML；未验证 XML 与 DER 等价性或设备安装有效性，因此不把该警告解释为篡改或必然无法运行。

## 公开资料来源

以下资料用于解释政策或 API 能力，不作为本样本已经执行相应行为的证据。核查日期为 2026年10月22日。

- [S1 Claude 支持地点](https://support.claude.com/en/articles/8461763-where-can-i-access-claude)
- [S2 账号停用与申诉](https://support.claude.com/en/articles/8241253-safeguards-warnings-and-appeals)
- [S3 Anthropic 位置隐私说明](https://privacy.claude.com/en/articles/11186740-does-claude-use-my-location)
- [S4 Apple Storefront](https://developer.apple.com/documentation/storekit/storefront)
- [S5 Apple App Attest](https://developer.apple.com/documentation/devicecheck/validating-apps-that-connect-to-your-server)
- [S6 Apple DeviceCheck](https://developer.apple.com/documentation/DeviceCheck)
- [S7 Sift iOS 集成文档](https://developers.sift.com/docs/v204/curl/mobile-sdk/ios)
