import {UrlTileSetModel, URLTileSetModelConstructorOptions} from "@luciad/ria/model/tileset/UrlTileSetModel";

import {getReference} from "@luciad/ria/reference/ReferenceProvider";
import {createBounds} from "@luciad/ria/shape/ShapeFactory";
import {AttributionTileRegion} from "@luciad/ria/model/tileset/AttributedTileSet";
import {createTransformation} from "@luciad/ria/transformation/TransformationFactory";
import {Transformation} from "@luciad/ria/transformation/Transformation";
import {Bounds} from "@luciad/ria/shape/Bounds";
import {EventedSupport} from "@luciad/ria/util/EventedSupport";
import {Handle} from "@luciad/ria/util/Evented";

const AttributionChanged = "AttributionChanged";

const WEB_MERCATOR = getReference("EPSG:3857");
const WGS84 = getReference("EPSG:4326");
export interface AzureMapTilesModelOptions {
    key: string;
    tilesetId: string;
    language?: string;
    version?: string;
    tileSize?: number;
    view?: string;
}

const svgString = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA4NjkuMjkxIDI4Ny4yNDQnIGhlaWdodD0nMjg3LjI0NCcgd2lkdGg9Jzg2OS4yOTEnIHhtbDpzcGFjZT0ncHJlc2VydmUnPjxwYXRoIHN0eWxlPSdmaWxsOiM3MzczNzM7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmUnIGQ9J20wIDAtNi4zODctMTguMTk3SDYuNTY3TC4yMTEgMFptNC40NTkgOC4wMTQgMTYuMjY4LTQzLjIwMmgtOC4yNTRMOC42NDYtMjQuNDYzSC04LjM3NWwtMy42NzYtMTAuNzI1aC04LjE5NEwtMy45NzcgOC4wMTRaJyB0cmFuc2Zvcm09J21hdHJpeCgxLjMzMzMzIDAgMCAtMS4zMzMzMyA1OTAuOTg0IDEyNS44NzQpJy8+PHBhdGggc3R5bGU9J2ZpbGw6IzczNzM3MztmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZScgZD0nTTAgMGgyNC43MzR2LTIuOTIyTDguNDk2LTI1LjE4N2gxNi4zMjh2LTUuNzg0SC0xLjE0NXYzLjQ2NUwxNC44NTMtNS43ODVIMFonIHRyYW5zZm9ybT0nbWF0cml4KDEuMzMzMzMgMCAwIC0xLjMzMzMzIDYyMy40OTIgMTMxLjQ5OCknLz48ZyBjbGlwLXBhdGg9J3VybCgjYSknIHRyYW5zZm9ybT0nbWF0cml4KDEuMzMzMzMgMCAwIC0xLjMzMzMzIDAgMjg3LjI0NCknPjxwYXRoIHN0eWxlPSdmaWxsOiM3MzczNzM7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmUnIGQ9J00wIDB2LTMwLjk3MWgtNy4zNTJ2NC4wNjhoLS4xMmMtLjk2NC0xLjQwNy0yLjI1NS0yLjUwNi0zLjg3MS0zLjMtMS42MTctLjc5My0zLjQyOS0xLjE5LTUuNDM4LTEuMTktMy41OTUgMC02LjMzMiAxLjAxOS04LjIwOSAzLjA1OS0xLjg3OSAyLjAzOC0yLjgxOCA1LjIwNi0yLjgxOCA5LjUwNFYwaDcuMzgxdi0xNy45NTZjMC0yLjYxMS41MTgtNC41NzQgMS41NTItNS44OSAxLjAzNC0xLjMxNiAyLjU5Ni0xLjk3MyA0LjY4NS0xLjk3MyAyLjA2OCAwIDMuNzI1LjcyOCA0Ljk3MSAyLjE4NCAxLjI0NSAxLjQ1NiAxLjg2NyAzLjM2IDEuODY3IDUuNzA5VjB6JyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSg1MjMuNDY5IDExNi44MSknLz48cGF0aCBzdHlsZT0nZmlsbDojNzM3MzczO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lJyBkPSdNMCAwYy41ODIgMCAxLjEwNC0uMDQgMS41NjYtLjEyYTYuNzExIDYuNzExIDAgMCAwIDEuMTc1LS4zMDF2LTcuMzgyYy0uMzgyLjI4Mi0uOTM4LjU0Ny0xLjY3Mi43OTktLjczMy4yNTEtMS42MjIuMzc2LTIuNjY2LjM3Ni0xLjc4OCAwLTMuMjk5LS43NTMtNC41MzQtMi4yNTktMS4yMzUtMS41MDctMS44NTItMy44MjYtMS44NTItNi45NnYtMTUuNjM1aC03LjI5MXYzMC45N2g3LjI5MXYtNC44ODFoLjEyYy42NjMgMS42ODcgMS42NjcgMy4wMDggMy4wMTIgMy45NjJDLTMuNTA1LS40NzctMS44ODggMCAwIDAnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDU0NS40MiAxMTcuMzIyKScvPjxwYXRoIHN0eWxlPSdmaWxsOiM3MzczNzM7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmUnIGQ9J00wIDBjMCAyLjQxLS41NTggNC4yNDgtMS42NzIgNS41MTMtMS4xMTUgMS4yNjUtMi42ODYgMS44OTgtNC43MTUgMS44OTgtMS43NDggMC0zLjMxNC0uNjI4LTQuNy0xLjg4M0MtMTIuNDczIDQuMjcyLTEzLjM5NiAyLjQzLTEzLjg1OCAwWm00LjY3LTEwLjgxNnYtNS45OTVjLTEuMjA1LS43NjQtMi43ODItMS4zODEtNC43MzEtMS44NTMtMS45NDgtLjQ3Mi00LjAyNi0uNzA4LTYuMjM2LS43MDgtNC43MiAwLTguMzkgMS4zOTYtMTEuMDExIDQuMTg4LTIuNjIxIDIuNzkxLTMuOTMxIDYuNjc4LTMuOTMxIDExLjY1OSAwIDQuOCAxLjQgOC43NTIgNC4yMDIgMTEuODU1IDIuODAyIDMuMTAzIDYuMzUxIDQuNjU0IDEwLjY1IDQuNjU0IDQuMjc4IDAgNy42MDctMS4zMSA5Ljk4OC0zLjkzMUM1Ljk4IDYuNDMyIDcuMTcgMi44MTIgNy4xNy0xLjgwOHYtMy41MjVoLTIxLjIwOWMuMzIxLTMuMTEzIDEuMzItNS4yODcgMi45OTctNi41MjIgMS42NzctMS4yMzUgMy44NDItMS44NTMgNi40OTMtMS44NTMgMS43NDcgMCAzLjQxNC4yNjYgNS4wMDEuNzk4IDEuNTg2LjUzMyAyLjk5MiAxLjIzIDQuMjE4IDIuMDk0JyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSg1NjkuNzM0IDEwNC40NTkpJy8+PC9nPjxnIGNsaXAtcGF0aD0ndXJsKCNiKScgdHJhbnNmb3JtPSdtYXRyaXgoMS4zMzMzMyAwIDAgLTEuMzMzMzMgMCAyODcuMjQ0KSc+PHBhdGggc3R5bGU9J2ZpbGw6IzczNzM3MztmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZScgZD0nTTAgMGgtMTAuODU4di0yNS4wMDRoLTcuMzhWMGgtNS4xODJ2NS45NjRoNS4xODJ2NC4zMDhjMCAzLjI1NCAxLjA1OSA1LjkyIDMuMTc4IDcuOTk5IDIuMTE5IDIuMDc5IDQuODM1IDMuMTE4IDguMTQ4IDMuMTE4Ljg4NCAwIDEuNjY3LS4wNDUgMi4zNTEtLjEzNmE5LjMgOS4zIDAgMCAwIDEuODA3LS40MDZ2LTYuMjk2Yy0uMjQxLjE0LS42NjMuMzEtMS4yNjUuNTEyLS42MDMuMi0xLjI5Ni4zMDEtMi4wNzguMzAxLTEuNTI4IDAtMi43MDItLjQ3Ny0zLjUyNi0xLjQzMS0uODIzLS45NTQtMS4yMzUtMi4zNjUtMS4yMzUtNC4yMzJWNS45NjRIMHY2Ljk2bDcuMzIxIDIuMjI5VjUuOTY0aDcuMzgxVjBINy4zMjF2LTE0LjQ5YzAtMS45MDkuMzQ2LTMuMjU1IDEuMDM5LTQuMDM3LjY5My0uNzg0IDEuNzgyLTEuMTc1IDMuMjY5LTEuMTc1LjQyMSAwIC45MjkuMSAxLjUyMS4zMDEuNTkyLjIgMS4xMDkuNDQxIDEuNTUyLjcyM3YtNi4wMjVjLS40NjMtLjI2MS0xLjIzMS0uNTAyLTIuMzA1LS43MjNhMTUuNzQyIDE1Ljc0MiAwIDAgMC0zLjE3OC0uMzMxYy0zLjA3MyAwLTUuMzc4LjgxNy02LjkxNCAyLjQ1NEMuNzY4LTIxLjY2NiAwLTE5LjIwMSAwLTE1LjkwNlptLTQ4LjQwNy05LjczMWMwLTMuMjM0LjczMy01LjcwNCAyLjE5OS03LjQxMSAxLjQ2Ni0xLjcwNyAzLjU2NC0yLjU2IDYuMjk2LTIuNTYgMi42NTIgMCA0LjY3Ljg1MyA2LjA1NSAyLjU2IDEuMzg2IDEuNzA3IDIuMDc5IDQuMjM4IDIuMDc5IDcuNTkyIDAgMy4zMzMtLjcxOCA1Ljg0OS0yLjE1NCA3LjU0Ny0xLjQzNiAxLjY5Ny0zLjQ0OSAyLjU0NS02LjA0IDIuNTQ1LTIuNjcyIDAtNC43NDUtLjg4OS02LjIyMS0yLjY2Ny0xLjQ3Ni0xLjc3Ni0yLjIxNC00LjMxMi0yLjIxNC03LjYwNm0tNy41OTItLjI0MWMwIDUuMTIyIDEuNDQ2IDkuMTc4IDQuMzM4IDEyLjE3MSAyLjg5MiAyLjk5MiA2LjkwOSA0LjQ4OSAxMi4wNTEgNC40ODkgNC44MzkgMCA4LjYyLTEuNDQxIDExLjM0Mi00LjMyMyAyLjcyMS0yLjg4MyA0LjA4Mi02Ljc3NCA0LjA4Mi0xMS42NzQgMC01LjAyMi0xLjQ0Ni05LjAxOC00LjMzOC0xMS45OS0yLjg5Mi0yLjk3My02LjgyOS00LjQ1OC0xMS44MDktNC40NTgtNC44MDEgMC04LjYxMiAxLjQxLTExLjQzMyA0LjIzMi0yLjgyMiAyLjgyMS00LjIzMyA2LjY3My00LjIzMyAxMS41NTNtLTE2LjQxNyA3LjgwM2MwLTEuMDQ1LjMzMS0xLjg2My45OTQtMi40NTYuNjYyLS41OTIgMi4xMjgtMS4zNCA0LjM5OS0yLjI0NCAyLjkxMS0xLjE2NSA0Ljk1NS0yLjQ3NSA2LjEyOS0zLjkzMSAxLjE3Ni0xLjQ1NiAxLjc2My0zLjIxOSAxLjc2My01LjI4NyAwLTIuOTEzLTEuMTE5LTUuMjUyLTMuMzU5LTcuMDE5LTIuMjM5LTEuNzY5LTUuMjY3LTIuNjUxLTkuMDgzLTIuNjUxLTEuMjg1IDAtMi43MDYuMTU1LTQuMjYzLjQ2Ni0xLjU1Ni4zMTItMi44NzcuNzA4LTMuOTYxIDEuMTl2Ny4xN2ExNy45NDUgMTcuOTQ1IDAgMCAxIDQuMjc4LTIuMTk4YzEuNTI2LS41NDMgMi45MTItLjgxNSA0LjE1Ny0uODE1IDEuNjQ3IDAgMi44NjIuMjMxIDMuNjQ2LjY5NC43ODMuNDYxIDEuMTc0IDEuMjM1IDEuMTc0IDIuMzE5IDAgMS4wMDUtLjQwNiAxLjg1My0xLjIyIDIuNTQ2LS44MTMuNjkzLTIuMzU1IDEuNDkxLTQuNjI0IDIuMzk1LTIuNjkyIDEuMTI0LTQuNTk5IDIuMzktNS43MjQgMy43OTUtMS4xMjUgMS40MDYtMS42ODcgMy4xOTQtMS42ODcgNS4zNjMgMCAyLjc5MSAxLjEwOSA1LjA4NiAzLjMyOSA2Ljg4NCAyLjIxOCAxLjc5NyA1LjA5NiAyLjY5NiA4LjYzMSAyLjY5NiAxLjA4NCAwIDIuMjk5LS4xMjEgMy42NDUtLjM2MSAxLjM0Ni0uMjQxIDIuNDctLjU1NCAzLjM3NS0uOTM1di02LjkyOWMtLjk2NS42NDQtMi4wOSAxLjE5NS0zLjM3NSAxLjY1OC0xLjI4Ni40NjItMi41NjEuNjkzLTMuODI2LjY5My0xLjM4NiAwLTIuNDY1LS4yNzEtMy4yMzgtLjgxMy0uNzc0LS41NDMtMS4xNi0xLjI4Ny0xLjE2LTIuMjNtLTM1LjA2NS03LjU2MmMwLTMuMjM0LjczMi01LjcwNCAyLjE5OS03LjQxMSAxLjQ2NS0xLjcwNyAzLjU2NC0yLjU2IDYuMjk1LTIuNTYgMi42NTIgMCA0LjY3Ljg1MyA2LjA1NSAyLjU2IDEuMzg3IDEuNzA3IDIuMDc5IDQuMjM4IDIuMDc5IDcuNTkyIDAgMy4zMzMtLjcxOCA1Ljg0OS0yLjE1NCA3LjU0N0MtOTQuNDQzLS4zMDYtOTYuNDU2LjU0Mi05OS4wNDYuNTQyYy0yLjY3MiAwLTQuNzQ2LS44ODktNi4yMjItMi42NjctMS40NzYtMS43NzYtMi4yMTMtNC4zMTItMi4yMTMtNy42MDZtLTcuNTkzLS4yNDFjMCA1LjEyMiAxLjQ0NiA5LjE3OCA0LjMzOSAxMi4xNzEgMi44OTIgMi45OTIgNi45MDggNC40ODkgMTIuMDQ5IDQuNDg5IDQuODQxIDAgOC42MjItMS40NDEgMTEuMzQzLTQuMzIzIDIuNzIxLTIuODgzIDQuMDgyLTYuNzc0IDQuMDgyLTExLjY3NCAwLTUuMDIyLTEuNDQ2LTkuMDE4LTQuMzM4LTExLjk5LTIuODkyLTIuOTczLTYuODI4LTQuNDU4LTExLjgwOS00LjQ1OC00LjgwMSAwLTguNjEyIDEuNDEtMTEuNDMzIDQuMjMyLTIuODIyIDIuODIxLTQuMjMzIDYuNjczLTQuMjMzIDExLjU1M20tMy4xMzYgMTYuNDQ5Yy41ODMgMCAxLjEwNS0uMDQxIDEuNTY3LS4xMjFhNi41NiA2LjU2IDAgMCAwIDEuMTc1LS4zMDF2LTcuMzgxYy0uMzgyLjI4Mi0uOTM5LjU0Ny0xLjY3Mi43OTktLjczMy4yNTEtMS42MjIuMzc2LTIuNjY2LjM3Ni0xLjc4OCAwLTMuMjk5LS43NTMtNC41MzQtMi4yNTktMS4yMzUtMS41MDctMS44NTMtMy44MjYtMS44NTMtNi45NTl2LTE1LjYzNWgtNy4yOVY1Ljk2NGg3LjI5di00Ljg4aC4xMmMuNjYzIDEuNjg3IDEuNjY3IDMuMDA3IDMuMDEzIDMuOTYyIDEuMzQ2Ljk1MyAyLjk2MiAxLjQzMSA0Ljg1IDEuNDMxbS0yNy45NTYtMjYuMTc5YzEuMDg0IDAgMi4yNzkuMjUgMy41ODUuNzUzYTE1LjA2IDE1LjA2IDAgMCAxIDMuNjE1IDEuOTg4di02Ljc3OGMtMS4xNjUtLjY2My0yLjQ4NS0xLjE2NS0zLjk2Mi0xLjUwNi0xLjQ3NS0uMzQyLTMuMDk4LS41MTItNC44NjUtLjUxMi00LjU1OSAwLTguMjY1IDEuNDQtMTEuMTE2IDQuMzIyLTIuODUyIDIuODgyLTQuMjc4IDYuNTYyLTQuMjc4IDExLjA0MSAwIDQuOTgxIDEuNDU3IDkuMDgzIDQuMzY5IDEyLjMwNyAyLjkxMSAzLjIyMyA3LjAzOSA0LjgzNSAxMi4zODEgNC44MzUgMS4zNjYgMCAyLjc0Ni0uMTc2IDQuMTQzLS41MjggMS4zOTUtLjM1MSAyLjUwNC0uNzU3IDMuMzI4LTEuMjE5di02Ljk5Yy0xLjEyNS44MjQtMi4yNzQgMS40NjItMy40NSAxLjkxNGE5Ljk2NiA5Ljk2NiAwIDAgMS0zLjU5OS42NzhjLTIuODcyIDAtNS4xOTItLjkzNS02Ljk1OS0yLjgwMi0xLjc2OC0xLjg2OC0yLjY1MS00LjM4OC0yLjY1MS03LjU2MiAwLTMuMTMzLjg0OC01LjU3MyAyLjU0NS03LjMyMSAxLjY5Ny0xLjc0NyA0LjAwMi0yLjYyIDYuOTE0LTIuNjJtLTIyLjExMi01LjMwMmgtNy4yOVY1Ljk2NWg3LjI5em0tOC4wNDQgMzkuOTE2YzAgMS4yMDUuNDM3IDIuMjE0IDEuMzExIDMuMDI3Ljg3NC44MTQgMS45MTIgMS4yMjEgMy4xMTcgMS4yMjEgMS4yODYgMCAyLjM1MS0uNDE4IDMuMTk0LTEuMjUuODQ0LS44MzQgMS4yNjUtMS44MzQgMS4yNjUtMi45OTggMC0xLjE4NS0uNDMxLTIuMTgtMS4yOTUtMi45ODItLjg2NC0uODA0LTEuOTE4LTEuMjA1LTMuMTY0LTEuMjA1LTEuMjQ1IDAtMi4yOTQuNDA2LTMuMTQ3IDEuMjE5LS44NTUuODE0LTEuMjgxIDEuODAzLTEuMjgxIDIuOTY4bS02LjI3MyAzLjI4M3YtNDMuMTk5aC03LjUwMXYzMy44NmgtLjEybC0xMy40MDctMzMuODZoLTQuOTdsLTEzLjczOCAzMy44NmgtLjA5di0zMy44NmgtNi45Mjl2NDMuMTk5aDEwLjc1NWwxMi40MTItMzIuMDIzaC4xOGwxMy4xMDUgMzIuMDIzeicgdHJhbnNmb3JtPSd0cmFuc2xhdGUoMzk0Ljk0MiAxMTAuODQ0KScvPjwvZz48cGF0aCBzdHlsZT0nZmlsbDojZjI1MDIyO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lJyBkPSdNMTA2LjIxMyAxMDkuMjJINzEuOTk1djM0LjIxOGgzNC4yMTh6JyB0cmFuc2Zvcm09J21hdHJpeCgxLjMzMzMzIDAgMCAtMS4zMzMzMyAwIDI4Ny4yNDQpJy8+PHBhdGggc3R5bGU9J2ZpbGw6IzdmYmEwMDtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZScgZD0nTTE0My45OTMgMTA5LjIyaC0zNC4yMTh2MzQuMjE4aDM0LjIxOHonIHRyYW5zZm9ybT0nbWF0cml4KDEuMzMzMzMgMCAwIC0xLjMzMzMzIDAgMjg3LjI0NCknLz48cGF0aCBzdHlsZT0nZmlsbDojMDBhNGVmO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lJyBkPSdNMTA2LjIxMyA3MS40NEg3MS45OTV2MzQuMjE4aDM0LjIxOHonIHRyYW5zZm9ybT0nbWF0cml4KDEuMzMzMzMgMCAwIC0xLjMzMzMzIDAgMjg3LjI0NCknLz48cGF0aCBzdHlsZT0nZmlsbDojZmZiOTAwO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lJyBkPSdNMTQzLjk5MyA3MS40NGgtMzQuMjE4djM0LjIxOGgzNC4yMTh6JyB0cmFuc2Zvcm09J21hdHJpeCgxLjMzMzMzIDAgMCAtMS4zMzMzMyAwIDI4Ny4yNDQpJy8+PHBhdGggc3R5bGU9J2ZpbGw6I2YyNTAyMjtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZScgZD0nTTEwNi4yMTMgMTA5LjIySDcxLjk5NXYzNC4yMThoMzQuMjE4eicgdHJhbnNmb3JtPSdtYXRyaXgoMS4zMzMzMyAwIDAgLTEuMzMzMzMgMCAyODcuMjQ0KScvPjxwYXRoIHN0eWxlPSdmaWxsOiM3ZmJhMDA7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmUnIGQ9J00xNDMuOTkzIDEwOS4yMmgtMzQuMjE4djM0LjIxOGgzNC4yMTh6JyB0cmFuc2Zvcm09J21hdHJpeCgxLjMzMzMzIDAgMCAtMS4zMzMzMyAwIDI4Ny4yNDQpJy8+PHBhdGggc3R5bGU9J2ZpbGw6IzAwYTRlZjtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZScgZD0nTTEwNi4yMTMgNzEuNDRINzEuOTk1djM0LjIxOGgzNC4yMTh6JyB0cmFuc2Zvcm09J21hdHJpeCgxLjMzMzMzIDAgMCAtMS4zMzMzMyAwIDI4Ny4yNDQpJy8+PHBhdGggc3R5bGU9J2ZpbGw6I2ZmYjkwMDtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZScgZD0nTTE0My45OTMgNzEuNDRoLTM0LjIxOHYzNC4yMThoMzQuMjE4eicgdHJhbnNmb3JtPSdtYXRyaXgoMS4zMzMzMyAwIDAgLTEuMzMzMzMgMCAyODcuMjQ0KScvPjwvc3ZnPg==";

export const AzureTileSets = {
    BaseRoad: "microsoft.base.road",
    BaseRoadDark: "microsoft.base.darkgrey",
    Imagery: "microsoft.imagery",
    HybridRoad: "microsoft.base.hybrid.road",
    HybridRoadDark: "microsoft.base.hybrid.darkgrey",
    Darkgrey: "microsoft.base.labels.darkgrey",
    LabelsRoad: "microsoft.base.labels.road",
    Terrain: "microsoft.terra.main",
    Traffic: "microsoft.traffic.relative.main",
    TrafficDark: "microsoft.traffic.relative.dark",
    Infrared: "microsoft.weather.infrared.main",
    Radar: "microsoft.weather.radar.main"
}

const TilesetZoomLevels = {
    "microsoft.base.road" : 22,
    "microsoft.imagery": 19,
    "microsoft.base.hybrid.road": 22,
    "microsoft.base.labels.darkgrey": 22,
    "microsoft.base.labels.road": 22,
    "microsoft.terra.main": 6,
    "microsoft.traffic.relative.main": 19,
    "microsoft.traffic.relative.dark": 19,
    "microsoft.weather.infrared.main": 15,
    "microsoft.weather.radar.main": 15
}

export class AzureMapTilesModel extends UrlTileSetModel {
    private static azureAttribution = "https://atlas.microsoft.com/map/attribution";
    private _lastRequestedRegions: AttributionTileRegion[];
    private _lastRequestResult: string[];
    private _referenceToWGS84: Transformation;
    private _areaBounds: Bounds;
    private _wgs84Bounds: Bounds;
    private readonly _eventedSupport: EventedSupport;
    private subscriptionKey: string;
    private tilesetId: string;

    constructor(options: AzureMapTilesModelOptions) {
        const azureUrl = "https://atlas.microsoft.com/map/tile";
        const apiVersion = options.version ? options.version : "2.1";
        const tilesetId = options.tilesetId ? options.tilesetId : AzureTileSets.Imagery;
        const language= options.language ? options.language : "en-US";
        const tileSize = options.tileSize ? options.tileSize : 256;
        const view = options.view ? options.view : "Auto";
        const subscriptionKey = options.key

        const baseURL = `${azureUrl}?api-version=${apiVersion}&tilesetId=${tilesetId}&zoom={z}&x={x}&y={-y}&tileSize=${tileSize}&language=${language}&view=${view}&subscription-key=${subscriptionKey}`;
        const levelCount = TilesetZoomLevels[tilesetId] ? TilesetZoomLevels[tilesetId] : 22;
        const urlTilesetModelOptions: URLTileSetModelConstructorOptions = {
            baseURL,
            credentials: false,
            structure: {
                levelCount,
                level0Columns: 1,
                level0Rows: 1,
                tileWidth: tileSize,
                tileHeight: tileSize,
                reference: WEB_MERCATOR,
                bounds: createBounds(WEB_MERCATOR, [-20037508.34278924, 40075016.68557848, -20037508.3520, 40075016.7040]),
            }
        }
        super(urlTilesetModelOptions);

        this.modelDescriptor = {
            source: this.baseURL,
            name: "Azure Tileset Model",
            description: "Azure Map Tiles API",
            type: super.dataType
        };
        // Several Azure layers do not have zoom-level 0, 'tileRefinementStrategy' helps to overcome this issue
        (this as any).tileRefinementStrategy = 1;
        this.subscriptionKey = subscriptionKey;
        this.tilesetId = tilesetId;
        this._referenceToWGS84 = createTransformation(WEB_MERCATOR, WGS84);
        this._areaBounds = createBounds(WEB_MERCATOR, []);
        this._wgs84Bounds = createBounds(WGS84, []);
        this._eventedSupport = new EventedSupport([AttributionChanged]);
    }

    public getAttribution(regions: AttributionTileRegion[]): string[] {
        if (this.isRegionCacheValid(regions)) return this._lastRequestResult;
        this._lastRequestedRegions = regions;
        const t = [];
        const s = new Map;
        for (const o of regions) {
            if (!t.includes(o.level)) t.push(o.level);
            this.addTileRegionToBoundsPerLevel(s, o)
        }
        const o = [];
        for (let e = 0; e < t.length; e++) {
            const zoom = t[e];
            const i = s.get(zoom);
            const options = {
                zoom: zoom,
                north: i.y + i.height,
                south: i.y,
                east: i.x + i.width,
                west: i.x
            };
            const subscriptionKey = this.subscriptionKey;
            const apiVersion = "2.1";
            const boundsStr = `${options.west},${options.south},${options.east},${options.north}`;
            const l = `${AzureMapTilesModel.azureAttribution}?api-version=${apiVersion}&tilesetId=${this.tilesetId}&zoom=${zoom}&bounds=${boundsStr}&subscription-key=${subscriptionKey}`;
            const u = request(l).then((response => response.json())).then((jsonData => {
                return jsonData.copyrights ?? ""
            })).catch((() => ""));
            o.push(u)
        }
        Promise.allSettled(o).then((e => {
            this._lastRequestResult = [];
            for (const t of e) if ("fulfilled" === t.status) {
                const linkArray = t.value;
                const aTags = linkArray.map(link=>{
                    const element  = document.createElement("div")
                    element.innerHTML = link;
                    return element.innerText;
                })
                if (!this._lastRequestResult.includes(aTags)) this._lastRequestResult.push(aTags)
            }
            this._eventedSupport.emit(AttributionChanged)
        })).catch((() => {}));
        return this._lastRequestResult

    }


    private isRegionCacheValid(regions: AttributionTileRegion[]) {
        if (!this._lastRequestedRegions) return false;
        if (this._lastRequestedRegions.length !== regions.length) return false;
        for (let t = 0; t < this._lastRequestedRegions.length; t++) if (!equalRegions(this._lastRequestedRegions[t], regions[t])) return false;
        return true
    }

    private addTileRegionToBoundsPerLevel(e:any, t: any) {
        const s = this.bounds;
        if (null === s) return;
        const o = t.level;
        const n = t.x;
        const i = t.y;
        const r = n + t.width;
        const a = i + t.height;
        const l = 1 << o;
        const u = 1 << o;
        const c = s.width / u;
        const h = s.height / l;
        const d = s.x + n * c;
        const p = s.y + i * h;
        const g = s.x + r * c;
        const f = s.y + a * h;
        const R = this._areaBounds;
        R.setTo2D(d, g - d, p, f - p);
        const m = this._referenceToWGS84.transformBounds(R, this._wgs84Bounds);
        if (e.has(o)) e.get(o).setTo3DUnion(m); else e.set(o, m)
    }

    override on(event: typeof AttributionChanged | "Invalidated" , callback: (...args: any[]) => void,
                context?: any): Handle {
        if (event === AttributionChanged) {
            return this._eventedSupport.on(event, callback, context);
        } else if (event === "Invalidated") {
            return super.on(event, callback, context);

        }
        return super.on(event, callback, context);
    }

    public getLogo() {
        return svgString;
    }

}

function equalRegions(e: any, t: any) {
    return e.level === t.level && e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height
}

function request(url: string) {
    return fetch(url);
}
