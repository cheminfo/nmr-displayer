# Changelog

## [0.18.0](https://www.github.com/cheminfo/nmrium/compare/v0.17.1...v0.18.0) (2021-07-16)


### Features

* add prop to hide panel on initial load ([#1171](https://www.github.com/cheminfo/nmrium/issues/1171)) ([b0cdd08](https://www.github.com/cheminfo/nmrium/commit/b0cdd08a1b427ce6d73b5f84dd721a1d14113dcd))


### Bug Fixes

* Range edition not working anymore ([2469601](https://www.github.com/cheminfo/nmrium/commit/2469601f3cd946edcfb6bb78cbebfe2718d3d2f4))

### [0.17.1](https://www.github.com/cheminfo/nmrium/compare/v0.17.0...v0.17.1) (2021-07-14)


### Bug Fixes

* set a default value for the data prop ([7daf6f4](https://www.github.com/cheminfo/nmrium/commit/7daf6f455eab1ed3b1bf14040cc5b1672de70b91))

## [0.17.0](https://www.github.com/cheminfo/nmrium/compare/v0.16.0...v0.17.0) (2021-07-14)


### Features

* change signal delta manually ([e079084](https://www.github.com/cheminfo/nmrium/commit/e079084cb6d62c7aa365ce10ab64e2b2948cc780))
* live update the tree during edition ([2886523](https://www.github.com/cheminfo/nmrium/commit/2886523a6994e0051fc7d9821d2c7616dd571cf2)), closes [#1079](https://www.github.com/cheminfo/nmrium/issues/1079)


### Bug Fixes

* [#879](https://www.github.com/cheminfo/nmrium/issues/879), [#898](https://www.github.com/cheminfo/nmrium/issues/898), [#961](https://www.github.com/cheminfo/nmrium/issues/961) and [#1089](https://www.github.com/cheminfo/nmrium/issues/1089) ([#1149](https://www.github.com/cheminfo/nmrium/issues/1149)) ([66dced0](https://www.github.com/cheminfo/nmrium/commit/66dced0b785625a8eaa00f80850af8476b6b428c))
* avoid re-renders due to the AlertProvider ([67f4edf](https://www.github.com/cheminfo/nmrium/commit/67f4edfa8da8c86e46134590335c8b0d6d035977))
* baseline correction crash when "degree" not between 1 - 6 ([defa111](https://www.github.com/cheminfo/nmrium/commit/defa111d9d4ecbdc893daec0896b6fb22c1e9c5f))
* correct style of molecule editor modal and ranges header outside of Vite ([7fa7775](https://www.github.com/cheminfo/nmrium/commit/7fa77753f7a3d6c7d79b5370ee7830a0ab5bec7f))
* do not use nullish coalescing operator ([1503727](https://www.github.com/cheminfo/nmrium/commit/150372717efe684efe715dfcfec51235b3a70b85))
* fill value in  signal input field when select range not working ([aa837fe](https://www.github.com/cheminfo/nmrium/commit/aa837fe2a76f993ba3dcacb5c19fbe22319a6961))
* prevent re-renders due to chart data provider ([e72c8c7](https://www.github.com/cheminfo/nmrium/commit/e72c8c718d14e375013022007d4018b1baf68074))
* prevent re-renders due to dropzone loader ([68c5879](https://www.github.com/cheminfo/nmrium/commit/68c58791dc531ada2779e5fd99aab7f77d195056))
* prevent re-renders due to modal provider ([882d160](https://www.github.com/cheminfo/nmrium/commit/882d160d2661ece9974739a9c29e4e85db073920))
* simplify help provider to avoid re-renders ([54cb76c](https://www.github.com/cheminfo/nmrium/commit/54cb76c082bf08df549760d75ee8458ac60834b1))
* update nmr-parser to 1.6.0 close[#1145](https://www.github.com/cheminfo/nmrium/issues/1145) ([#1156](https://www.github.com/cheminfo/nmrium/issues/1156)) ([532f2d5](https://www.github.com/cheminfo/nmrium/commit/532f2d5cffb352544f049bde97c357a43c17e1a3))
* use Delete instead of Escape as Backspace alias ([cd04968](https://www.github.com/cheminfo/nmrium/commit/cd049689d5acfa1ea8231791480b9bfedc5098de))

## [0.16.0](https://www.github.com/cheminfo/nmrium/compare/v0.15.0...v0.16.0) (2021-06-21)


### ⚠ BREAKING CHANGES

* The docsBaseUrl prop was removed. Documentation will always be at https://docs.nmrium.org

### Bug Fixes

* convert value to string crash when have null value ([c632ee9](https://www.github.com/cheminfo/nmrium/commit/c632ee98359f9b58dac3f001a857500ce29c9398)), closes [#1144](https://www.github.com/cheminfo/nmrium/issues/1144)
* Drag and drop jcamp -> export -> import not working ([870d82a](https://www.github.com/cheminfo/nmrium/commit/870d82a1a3cfc0d9a7d1d72d27d4f451612d4a56)), closes [#1143](https://www.github.com/cheminfo/nmrium/issues/1143)
* Help broken ([fbaec53](https://www.github.com/cheminfo/nmrium/commit/fbaec535c2ed6c44be355bc4cc24ac6d52604552)), closes [#1132](https://www.github.com/cheminfo/nmrium/issues/1132)
* integral in fixed mode for integrals and ranges ([eaf7d4a](https://www.github.com/cheminfo/nmrium/commit/eaf7d4af23b9841c721da0c740978d04c9522f08)), closes [#1131](https://www.github.com/cheminfo/nmrium/issues/1131)
* Prop validation error when closing the right panels area ([ad1028e](https://www.github.com/cheminfo/nmrium/commit/ad1028e384714ebee0b9413b351d7396fbb1129e)), closes [#1141](https://www.github.com/cheminfo/nmrium/issues/1141)
* Ranges are displayed incorrectly in case of spectrum shifts ([985b583](https://www.github.com/cheminfo/nmrium/commit/985b5830e76bb86a89229a13d4b46b4d170cc5c5))


### Miscellaneous Chores

* remove docsBaseUrl and refactor constants ([c8a35af](https://www.github.com/cheminfo/nmrium/commit/c8a35af896bc483e80ba4fd1410de5985174b93f))

## [0.15.0](https://www.github.com/cheminfo/nmrium/compare/v0.14.0...v0.15.0) (2021-06-17)


### Features

* allows to continue to control phase when mouse leave the button ([613e5da](https://www.github.com/cheminfo/nmrium/commit/613e5da80b1c454c5cbc92de1c682b04c8eee9e5))
* improve error message ([68eda7c](https://www.github.com/cheminfo/nmrium/commit/68eda7c67368f3b4c7eea2366300afe34bfbe27e))
* update nmr-parser to 1.4.0 ([11d13b7](https://www.github.com/cheminfo/nmrium/commit/11d13b7985471d0ff16e64d1c85730e691314606))


### Bug Fixes

* change props to be non-required ([40dd75c](https://www.github.com/cheminfo/nmrium/commit/40dd75c9bb966d0f00475c900431458ee2519391))
* close [#1112](https://www.github.com/cheminfo/nmrium/issues/1112) ([#1114](https://www.github.com/cheminfo/nmrium/issues/1114)) ([5990eed](https://www.github.com/cheminfo/nmrium/commit/5990eedd0a4df4768bd6bf9bac685ccc993afebe))
* edit range manually crash ([254d10f](https://www.github.com/cheminfo/nmrium/commit/254d10fd9718887201062e8afb573c7d0c7962b4)), closes [#1124](https://www.github.com/cheminfo/nmrium/issues/1124)
* formating and filter general bugs ([ea19f6d](https://www.github.com/cheminfo/nmrium/commit/ea19f6db1b79d9cfd16c842c3fa3e73c6b6bead2)), closes [#1135](https://www.github.com/cheminfo/nmrium/issues/1135) [#1134](https://www.github.com/cheminfo/nmrium/issues/1134) [#1133](https://www.github.com/cheminfo/nmrium/issues/1133)
* improve phase correction ([c3d889e](https://www.github.com/cheminfo/nmrium/commit/c3d889ebe21eba02bac71c65d4646417807c9b96))
* integral value under integral plot not updating ([04a062b](https://www.github.com/cheminfo/nmrium/commit/04a062be16d6f82e23098c970596ad7183ce3f14)), closes [#1123](https://www.github.com/cheminfo/nmrium/issues/1123)
* Phase correction shortcut not working ([c56592d](https://www.github.com/cheminfo/nmrium/commit/c56592d238576eb6d1e074586087c487d81f41fe)), closes [#1121](https://www.github.com/cheminfo/nmrium/issues/1121)
* sanplot when not negative/positive values exist ([aa90fa0](https://www.github.com/cheminfo/nmrium/commit/aa90fa0c0e080f2be9190addc3bc745eb432c76f))
* use useRef ([b360911](https://www.github.com/cheminfo/nmrium/commit/b360911047fb9885a077863b86d882536f775382))

## [0.14.0](https://www.github.com/cheminfo/nmrium/compare/v0.13.0...v0.14.0) (2021-05-20)


### Features

* enhance sanplot ([#1090](https://www.github.com/cheminfo/nmrium/issues/1090)) ([adf371b](https://www.github.com/cheminfo/nmrium/commit/adf371b8f72d38c2a3eac74d447961f32bdb6e7c))
* improve default values for auto phase. close [#1093](https://www.github.com/cheminfo/nmrium/issues/1093) ([#1099](https://www.github.com/cheminfo/nmrium/issues/1099)) ([a2d67a4](https://www.github.com/cheminfo/nmrium/commit/a2d67a40119467da7d4931cfa118d1488a83a404))


### Bug Fixes

* allow to save as shortcut on osX ([ade53cd](https://www.github.com/cheminfo/nmrium/commit/ade53cdde82430ddd1ba0fd4be8d503fa79ed30d))
* always use the zones for polynomial baseline correction. ([#1092](https://www.github.com/cheminfo/nmrium/issues/1092)) ([cf7fa99](https://www.github.com/cheminfo/nmrium/commit/cf7fa99f5852f06a3be604e976df036591a23609))
* build demo site using relative URLs ([8e4f668](https://www.github.com/cheminfo/nmrium/commit/8e4f668498a982f3a24ffc4c041ad1edf5eb2ffc))
* change integral sum modal style ([e5cf78e](https://www.github.com/cheminfo/nmrium/commit/e5cf78e4e86c2b0dfec2909dab64d4f2344609b5)), closes [#1062](https://www.github.com/cheminfo/nmrium/issues/1062)
* crash when add spectra filter ([1a6ab62](https://www.github.com/cheminfo/nmrium/commit/1a6ab62e2f75590590761cacd61a19a3ba76c0ae)), closes [#1083](https://www.github.com/cheminfo/nmrium/issues/1083)
* In "Export As" data included even when "include data" unchecked ([5aa068a](https://www.github.com/cheminfo/nmrium/commit/5aa068a6c486f815d7c3cdbbcc997224113da7f0))
* **projection:** fix wrong number of points. close [#1041](https://www.github.com/cheminfo/nmrium/issues/1041) ([#1095](https://www.github.com/cheminfo/nmrium/issues/1095)) ([44139a0](https://www.github.com/cheminfo/nmrium/commit/44139a049363d6987b869985689c000d44ab8ae0))

## [0.13.0](https://www.github.com/cheminfo/nmrium/compare/v0.12.0...v0.13.0) (2021-05-13)


### Features

* add getAtomsFromMF ([e29bcbf](https://www.github.com/cheminfo/nmrium/commit/e29bcbf56fcbf89ae76fbb1c37f485b606d03140))
* update dependencies nmr-parser and ml-spectra-processing ([#1042](https://www.github.com/cheminfo/nmrium/issues/1042)) ([d443fd7](https://www.github.com/cheminfo/nmrium/commit/d443fd7e3bd9d34ecf9ccaa7e38153bef9e4f802))


### Bug Fixes

* better display for version and link to github ([4a2d70f](https://www.github.com/cheminfo/nmrium/commit/4a2d70fbfc674451b6b3b30f89ab5c77285b05c9))
* crash when edit and save range. ([907b49f](https://www.github.com/cheminfo/nmrium/commit/907b49f214f1d26dc47c536d8f6500be97c8ebd7)), closes [#1031](https://www.github.com/cheminfo/nmrium/issues/1031)
* do not import lodash directly ([ca47250](https://www.github.com/cheminfo/nmrium/commit/ca47250f078bc6d138ca4013076d148e739a5d8c))

## [0.12.0](https://www.github.com/cheminfo/nmrium/compare/v0.11.0...v0.12.0) (2021-05-07)


### Features

* " Export As " feature ([60e6430](https://www.github.com/cheminfo/nmrium/commit/60e6430fafd6ae7a40dddf4ba3cf66c1425cdd06))
* 1d histogram ([e4178f1](https://www.github.com/cheminfo/nmrium/commit/e4178f1f780eb55e7d9cbe6db59e5d4fd93e9134))
* 2d histogram ([50f83da](https://www.github.com/cheminfo/nmrium/commit/50f83dab4ed176dde8c9ed56e225b72d28610d5a))
* add equally spaced filter. ([5d9953c](https://www.github.com/cheminfo/nmrium/commit/5d9953c6722efd45d02a4810324fe6976f74a822))
* add new filters ([cdb9e98](https://www.github.com/cheminfo/nmrium/commit/cdb9e987ab12de0084e8040ca40a89ba84bf6624))
* Add new tool to draw exclusion zones ([1d48ebd](https://www.github.com/cheminfo/nmrium/commit/1d48ebdd425ef9a97b3dc2d28225f3fba1b2e859))
* add the base for Multiple spectra filter. ([39cf861](https://www.github.com/cheminfo/nmrium/commit/39cf861610a29931bb4040b32b22eaee5123ef4c))
* Advanced save in .nmrium data ([e59700b](https://www.github.com/cheminfo/nmrium/commit/e59700bb60fedd3546c72a5af0956664a0b00bd5))
* auto peak picking based on window zoom ([b7592b3](https://www.github.com/cheminfo/nmrium/commit/b7592b34efbf20caa239ea6e233b0441a730a480))
* auto ranges detection based on window zoom ([792ea3f](https://www.github.com/cheminfo/nmrium/commit/792ea3fdccc10152f064a2385f0754b38151e108))
* auto zone detection within zoom region ([#975](https://www.github.com/cheminfo/nmrium/issues/975)) ([f0452d4](https://www.github.com/cheminfo/nmrium/commit/f0452d493b74eacd07cd8f509086376e0e3338aa))
* avoid from > to in manual zone selection ([#978](https://www.github.com/cheminfo/nmrium/issues/978)) ([326ed14](https://www.github.com/cheminfo/nmrium/commit/326ed1452904d95d09f7a26adab71cce1d8285c6))
* change default color order ([7b95026](https://www.github.com/cheminfo/nmrium/commit/7b950263395370342fa7b2a6a33695db143b8f52))
* enable nmrium to load zip files with bruker folder and others ([#1024](https://www.github.com/cheminfo/nmrium/issues/1024)) ([0aa42b1](https://www.github.com/cheminfo/nmrium/commit/0aa42b1d492f518f77c944f64585899ab00cee60))
* fix wrong step size calculation-getSubMatrix ([e1e6ef0](https://www.github.com/cheminfo/nmrium/commit/e1e6ef08c58b6f0d98912e7747947faf6e15498b)), closes [#616](https://www.github.com/cheminfo/nmrium/issues/616) [#642](https://www.github.com/cheminfo/nmrium/issues/642) [#785](https://www.github.com/cheminfo/nmrium/issues/785) [#620](https://www.github.com/cheminfo/nmrium/issues/620)
* importation and exportation of nmredata ([#989](https://www.github.com/cheminfo/nmrium/issues/989)) ([7ae8c8c](https://www.github.com/cheminfo/nmrium/commit/7ae8c8cddce061023328c84224c728f2c1cabcb8))
* **nmredata:** refactor of importation/exportation ([#1007](https://www.github.com/cheminfo/nmrium/issues/1007)) ([3f539e0](https://www.github.com/cheminfo/nmrium/commit/3f539e08952bf6ab0406e6edc71ffc48096e8fa4))
* use refactored nmr-correlation package ([#1025](https://www.github.com/cheminfo/nmrium/issues/1025)) ([990eb54](https://www.github.com/cheminfo/nmrium/commit/990eb54b96130a740b26bd4a12104ba5abddfcf8))


### Bug Fixes

* " delete all " not delete all spectra. ([54907de](https://www.github.com/cheminfo/nmrium/commit/54907dec21890b74cb7eaee849c13571f8d5388e)), closes [#1028](https://www.github.com/cheminfo/nmrium/issues/1028)
* 1D and 2D histograms ([8211ff2](https://www.github.com/cheminfo/nmrium/commit/8211ff21026f6444676963c5b76d9f8a0501577a))
* avoid out-of-range indexes in zone detection ([984f297](https://www.github.com/cheminfo/nmrium/commit/984f297f7ad577f4a36909a3121ab05e58c7f66f))
* correctly build for CDN ([86dcce3](https://www.github.com/cheminfo/nmrium/commit/86dcce3a7b705df1d55d80a98429394a30385195))
* crash when select a filter. ([df6e2ba](https://www.github.com/cheminfo/nmrium/commit/df6e2baeced0caa0fd33283d8372cc1c0cde76fc))
* default color for noesy / roesy ([ccd7f9a](https://www.github.com/cheminfo/nmrium/commit/ccd7f9aa368691f7ea01a3f500bd1cb0862069a5))
* fromTo Filter ([aa8ccbc](https://www.github.com/cheminfo/nmrium/commit/aa8ccbc3961e083813df1150924c1a07c55f91fc))
* improve chart ([1695bda](https://www.github.com/cheminfo/nmrium/commit/1695bda0972bd6040393380f9a19cbc6667da33d))
* modal come over the table header, context menu not clickable. ([aac0944](https://www.github.com/cheminfo/nmrium/commit/aac094449a1ec9573a0f65f11301db4071394a39))
* Peak picking add repeatitive CSS in the DOM. ([40a5398](https://www.github.com/cheminfo/nmrium/commit/40a539894fb5929d2184d236de8bd66fd71cb5c8)), closes [#1009](https://www.github.com/cheminfo/nmrium/issues/1009)
* Peaks not align vertically in stack mode ([8d2bf59](https://www.github.com/cheminfo/nmrium/commit/8d2bf59f81024121c2c93a88886e955b915bbdf5)), closes [#1026](https://www.github.com/cheminfo/nmrium/issues/1026)
* peaks pointer vertical alignment in stack mode ([ac4fa8e](https://www.github.com/cheminfo/nmrium/commit/ac4fa8e0cba16ae52cb04e4777053df963826b02))
* prevent duplication in auto peaks detection. ([7bead8d](https://www.github.com/cheminfo/nmrium/commit/7bead8dbbbe94f2092c6e35e33998794115e6ba1))
* prevent duplication in auto ranges detection. ([2ca4a3a](https://www.github.com/cheminfo/nmrium/commit/2ca4a3aef6ca432d539312870ebe69875027dcee))
* prevent duplication in auto zones detection. ([1b13e26](https://www.github.com/cheminfo/nmrium/commit/1b13e262cbc10ed67a4f24ba3abadd60447596a8)), closes [#976](https://www.github.com/cheminfo/nmrium/issues/976)
* processed 13C example to deal with new peak format ([9dff439](https://www.github.com/cheminfo/nmrium/commit/9dff4391b5546ed6ca64f42ef301c5bdf37eb5e4))
* processed13C example and peak picking ([bad982f](https://www.github.com/cheminfo/nmrium/commit/bad982fe1701d1a39b98fdbec7d805badffd8930))
* Select component onChange event not firing on firefox ([f05e6d2](https://www.github.com/cheminfo/nmrium/commit/f05e6d2ac774620790327fa4852233db6ef98e3b)), closes [#991](https://www.github.com/cheminfo/nmrium/issues/991)
* update dependencies ([bd4e4e5](https://www.github.com/cheminfo/nmrium/commit/bd4e4e54aa4af97f83fe8184326ec1e70568298b))
* update nmr-parser / jcamp converter ([bd6d870](https://www.github.com/cheminfo/nmrium/commit/bd6d870e2223223f1cf46f960b045c100dfbbb80))
* use react-shadow to avoid being affected by external style ([fd7b803](https://www.github.com/cheminfo/nmrium/commit/fd7b803a4a567797caf258c2fee1210655f4fd00))

## [0.11.0](https://www.github.com/cheminfo/nmrium/compare/v0.10.0...v0.11.0) (2021-04-12)


### Features

* add prop to define the message on NMRium ([#967](https://www.github.com/cheminfo/nmrium/issues/967)) ([22db9ce](https://www.github.com/cheminfo/nmrium/commit/22db9ce6edaf4529fc563b107c9830d7b1d25b4f)), closes [#951](https://www.github.com/cheminfo/nmrium/issues/951)
* export and import NMRIUM file as ZIP. ([7bf6f44](https://www.github.com/cheminfo/nmrium/commit/7bf6f44b39122060b202a24030e2d3607f7c755d))
* export to nmredata ([#969](https://www.github.com/cheminfo/nmrium/issues/969)) ([c06e5ac](https://www.github.com/cheminfo/nmrium/commit/c06e5acfd19ec5c3c8e23a6ee3ee84e35c41650a))
* fix prefix of the path to jcamp file in nmredata exportation ([64b329a](https://www.github.com/cheminfo/nmrium/commit/64b329afcbdba237e7fd0d1f85dd87de66a6f0b6))


### Bug Fixes

* Keep table header fixed. ([cae5d0c](https://www.github.com/cheminfo/nmrium/commit/cae5d0c07086b0fde616e8d0798ebfb522ff19a5))
* **metadata:** export molfile without implicit hydrogens ([5b6f3cd](https://www.github.com/cheminfo/nmrium/commit/5b6f3cde97db43dd0d80db200ed69bb468565b43))
* Modals should not open outside of the component ([e599f8d](https://www.github.com/cheminfo/nmrium/commit/e599f8d7cbf896aa80b6c0f8083390997a616f01))

## [0.10.0](https://www.github.com/cheminfo/nmrium/compare/v0.9.0...v0.10.0) (2021-04-05)


### Features

* add getSpinner prop for custom loading spinner ([20a5137](https://www.github.com/cheminfo/nmrium/commit/20a51371b083f11f5128c352666a8c49666a8fa9))
* add links highlight in predicted 1H spectra ([c256fcf](https://www.github.com/cheminfo/nmrium/commit/c256fcf62159bbef05c10f9f91e2287aea3349f4))
* increase version to 0.9.0 ([9ea9758](https://www.github.com/cheminfo/nmrium/commit/9ea97585dbf4f78766fa1618f271ff15aa816774))


### Bug Fixes

* add padding to NoData element ([7505da7](https://www.github.com/cheminfo/nmrium/commit/7505da7153b3124c6d765c906bc847c4d0c28198))
* link in readme ([3513dab](https://www.github.com/cheminfo/nmrium/commit/3513dabde8a51e551fd02540429aa1eff154b56f))
* make display properties optional ([f9ca9e1](https://www.github.com/cheminfo/nmrium/commit/f9ca9e1972e2fa73e10da91ffbdd3079c74169ca))
