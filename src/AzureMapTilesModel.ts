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

const svgString = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbDpzcGFjZT0icHJlc2VydmUiIHZpZXdCb3g9Ijk1Ljk5IDk1Ljk5IDY3My4yMSA5NiI+PHBhdGggc3R5bGU9ImZpbGw6IzczNzM3MztmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZSIgZD0ibTAgMC02LjM4Ny0xOC4xOTdINi41NjdMLjIxMSAwem00LjQ1OSA4LjAxNCAxNi4yNjgtNDMuMjAyaC04LjI1NEw4LjY0Ni0yNC40NjNILTguMzc1bC0zLjY3Ni0xMC43MjVoLTguMTk0TC0zLjk3NyA4LjAxNHoiIHRyYW5zZm9ybT0ibWF0cml4KDEuMzMzMzMgMCAwIC0xLjMzMzMzIDU5MC45ODQgMTI1Ljg3NCkiLz48cGF0aCBzdHlsZT0iZmlsbDojNzM3MzczO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lIiBkPSJNMCAwaDI0LjczNHYtMi45MjJMOC40OTYtMjUuMTg3aDE2LjMyOHYtNS43ODRILTEuMTQ1djMuNDY1TDE0Ljg1My01Ljc4NUgweiIgdHJhbnNmb3JtPSJtYXRyaXgoMS4zMzMzMyAwIDAgLTEuMzMzMzMgNjIzLjQ5MiAxMzEuNDk4KSIvPjxnIGNsaXAtcGF0aD0idXJsKCNhKSIgdHJhbnNmb3JtPSJtYXRyaXgoMS4zMzMzMyAwIDAgLTEuMzMzMzMgMCAyODcuMjQ0KSI+PHBhdGggc3R5bGU9ImZpbGw6IzczNzM3MztmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZSIgZD0iTTAgMHYtMzAuOTcxaC03LjM1MnY0LjA2OGgtLjEyYy0uOTY0LTEuNDA3LTIuMjU1LTIuNTA2LTMuODcxLTMuMy0xLjYxNy0uNzkzLTMuNDI5LTEuMTktNS40MzgtMS4xOS0zLjU5NSAwLTYuMzMyIDEuMDE5LTguMjA5IDMuMDU5LTEuODc5IDIuMDM4LTIuODE4IDUuMjA2LTIuODE4IDkuNTA0VjBoNy4zODF2LTE3Ljk1NmMwLTIuNjExLjUxOC00LjU3NCAxLjU1Mi01Ljg5IDEuMDM0LTEuMzE2IDIuNTk2LTEuOTczIDQuNjg1LTEuOTczIDIuMDY4IDAgMy43MjUuNzI4IDQuOTcxIDIuMTg0IDEuMjQ1IDEuNDU2IDEuODY3IDMuMzYgMS44NjcgNS43MDlWMHoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUyMy40NjkgMTE2LjgxKSIvPjxwYXRoIHN0eWxlPSJmaWxsOiM3MzczNzM7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmUiIGQ9Ik0wIDBjLjU4MiAwIDEuMTA0LS4wNCAxLjU2Ni0uMTJhNi43MTEgNi43MTEgMCAwIDAgMS4xNzUtLjMwMXYtNy4zODJjLS4zODIuMjgyLS45MzguNTQ3LTEuNjcyLjc5OS0uNzMzLjI1MS0xLjYyMi4zNzYtMi42NjYuMzc2LTEuNzg4IDAtMy4yOTktLjc1My00LjUzNC0yLjI1OS0xLjIzNS0xLjUwNy0xLjg1Mi0zLjgyNi0xLjg1Mi02Ljk2di0xNS42MzVoLTcuMjkxdjMwLjk3aDcuMjkxdi00Ljg4MWguMTJjLjY2MyAxLjY4NyAxLjY2NyAzLjAwOCAzLjAxMiAzLjk2MkMtMy41MDUtLjQ3Ny0xLjg4OCAwIDAgMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTQ1LjQyIDExNy4zMjIpIi8+PHBhdGggc3R5bGU9ImZpbGw6IzczNzM3MztmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZSIgZD0iTTAgMGMwIDIuNDEtLjU1OCA0LjI0OC0xLjY3MiA1LjUxMy0xLjExNSAxLjI2NS0yLjY4NiAxLjg5OC00LjcxNSAxLjg5OC0xLjc0OCAwLTMuMzE0LS42MjgtNC43LTEuODgzQy0xMi40NzMgNC4yNzItMTMuMzk2IDIuNDMtMTMuODU4IDB6bTQuNjctMTAuODE2di01Ljk5NWMtMS4yMDUtLjc2NC0yLjc4Mi0xLjM4MS00LjczMS0xLjg1My0xLjk0OC0uNDcyLTQuMDI2LS43MDgtNi4yMzYtLjcwOC00LjcyIDAtOC4zOSAxLjM5Ni0xMS4wMTEgNC4xODgtMi42MjEgMi43OTEtMy45MzEgNi42NzgtMy45MzEgMTEuNjU5IDAgNC44IDEuNCA4Ljc1MiA0LjIwMiAxMS44NTUgMi44MDIgMy4xMDMgNi4zNTEgNC42NTQgMTAuNjUgNC42NTQgNC4yNzggMCA3LjYwNy0xLjMxIDkuOTg4LTMuOTMxQzUuOTggNi40MzIgNy4xNyAyLjgxMiA3LjE3LTEuODA4di0zLjUyNWgtMjEuMjA5Yy4zMjEtMy4xMTMgMS4zMi01LjI4NyAyLjk5Ny02LjUyMiAxLjY3Ny0xLjIzNSAzLjg0Mi0xLjg1MyA2LjQ5My0xLjg1MyAxLjc0NyAwIDMuNDE0LjI2NiA1LjAwMS43OTggMS41ODYuNTMzIDIuOTkyIDEuMjMgNC4yMTggMi4wOTQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDU2OS43MzQgMTA0LjQ1OSkiLz48L2c+PGcgY2xpcC1wYXRoPSJ1cmwoI2IpIiB0cmFuc2Zvcm09Im1hdHJpeCgxLjMzMzMzIDAgMCAtMS4zMzMzMyAwIDI4Ny4yNDQpIj48cGF0aCBzdHlsZT0iZmlsbDojNzM3MzczO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lIiBkPSJNMCAwaC0xMC44NTh2LTI1LjAwNGgtNy4zOFYwaC01LjE4MnY1Ljk2NGg1LjE4MnY0LjMwOGMwIDMuMjU0IDEuMDU5IDUuOTIgMy4xNzggNy45OTkgMi4xMTkgMi4wNzkgNC44MzUgMy4xMTggOC4xNDggMy4xMTguODg0IDAgMS42NjctLjA0NSAyLjM1MS0uMTM2YTkuMyA5LjMgMCAwIDAgMS44MDctLjQwNnYtNi4yOTZjLS4yNDEuMTQtLjY2My4zMS0xLjI2NS41MTItLjYwMy4yLTEuMjk2LjMwMS0yLjA3OC4zMDEtMS41MjggMC0yLjcwMi0uNDc3LTMuNTI2LTEuNDMxLS44MjMtLjk1NC0xLjIzNS0yLjM2NS0xLjIzNS00LjIzMlY1Ljk2NEgwdjYuOTZsNy4zMjEgMi4yMjlWNS45NjRoNy4zODFWMEg3LjMyMXYtMTQuNDljMC0xLjkwOS4zNDYtMy4yNTUgMS4wMzktNC4wMzcuNjkzLS43ODQgMS43ODItMS4xNzUgMy4yNjktMS4xNzUuNDIxIDAgLjkyOS4xIDEuNTIxLjMwMS41OTIuMiAxLjEwOS40NDEgMS41NTIuNzIzdi02LjAyNWMtLjQ2My0uMjYxLTEuMjMxLS41MDItMi4zMDUtLjcyM2ExNS43NDIgMTUuNzQyIDAgMCAwLTMuMTc4LS4zMzFjLTMuMDczIDAtNS4zNzguODE3LTYuOTE0IDIuNDU0Qy43NjgtMjEuNjY2IDAtMTkuMjAxIDAtMTUuOTA2em0tNDguNDA3LTkuNzMxYzAtMy4yMzQuNzMzLTUuNzA0IDIuMTk5LTcuNDExIDEuNDY2LTEuNzA3IDMuNTY0LTIuNTYgNi4yOTYtMi41NiAyLjY1MiAwIDQuNjcuODUzIDYuMDU1IDIuNTYgMS4zODYgMS43MDcgMi4wNzkgNC4yMzggMi4wNzkgNy41OTIgMCAzLjMzMy0uNzE4IDUuODQ5LTIuMTU0IDcuNTQ3LTEuNDM2IDEuNjk3LTMuNDQ5IDIuNTQ1LTYuMDQgMi41NDUtMi42NzIgMC00Ljc0NS0uODg5LTYuMjIxLTIuNjY3LTEuNDc2LTEuNzc2LTIuMjE0LTQuMzEyLTIuMjE0LTcuNjA2bS03LjU5Mi0uMjQxYzAgNS4xMjIgMS40NDYgOS4xNzggNC4zMzggMTIuMTcxIDIuODkyIDIuOTkyIDYuOTA5IDQuNDg5IDEyLjA1MSA0LjQ4OSA0LjgzOSAwIDguNjItMS40NDEgMTEuMzQyLTQuMzIzIDIuNzIxLTIuODgzIDQuMDgyLTYuNzc0IDQuMDgyLTExLjY3NCAwLTUuMDIyLTEuNDQ2LTkuMDE4LTQuMzM4LTExLjk5LTIuODkyLTIuOTczLTYuODI5LTQuNDU4LTExLjgwOS00LjQ1OC00LjgwMSAwLTguNjEyIDEuNDEtMTEuNDMzIDQuMjMyLTIuODIyIDIuODIxLTQuMjMzIDYuNjczLTQuMjMzIDExLjU1M20tMTYuNDE3IDcuODAzYzAtMS4wNDUuMzMxLTEuODYzLjk5NC0yLjQ1Ni42NjItLjU5MiAyLjEyOC0xLjM0IDQuMzk5LTIuMjQ0IDIuOTExLTEuMTY1IDQuOTU1LTIuNDc1IDYuMTI5LTMuOTMxIDEuMTc2LTEuNDU2IDEuNzYzLTMuMjE5IDEuNzYzLTUuMjg3IDAtMi45MTMtMS4xMTktNS4yNTItMy4zNTktNy4wMTktMi4yMzktMS43NjktNS4yNjctMi42NTEtOS4wODMtMi42NTEtMS4yODUgMC0yLjcwNi4xNTUtNC4yNjMuNDY2LTEuNTU2LjMxMi0yLjg3Ny43MDgtMy45NjEgMS4xOXY3LjE3YTE3Ljk0NSAxNy45NDUgMCAwIDEgNC4yNzgtMi4xOThjMS41MjYtLjU0MyAyLjkxMi0uODE1IDQuMTU3LS44MTUgMS42NDcgMCAyLjg2Mi4yMzEgMy42NDYuNjk0Ljc4My40NjEgMS4xNzQgMS4yMzUgMS4xNzQgMi4zMTkgMCAxLjAwNS0uNDA2IDEuODUzLTEuMjIgMi41NDYtLjgxMy42OTMtMi4zNTUgMS40OTEtNC42MjQgMi4zOTUtMi42OTIgMS4xMjQtNC41OTkgMi4zOS01LjcyNCAzLjc5NS0xLjEyNSAxLjQwNi0xLjY4NyAzLjE5NC0xLjY4NyA1LjM2MyAwIDIuNzkxIDEuMTA5IDUuMDg2IDMuMzI5IDYuODg0IDIuMjE4IDEuNzk3IDUuMDk2IDIuNjk2IDguNjMxIDIuNjk2IDEuMDg0IDAgMi4yOTktLjEyMSAzLjY0NS0uMzYxIDEuMzQ2LS4yNDEgMi40Ny0uNTU0IDMuMzc1LS45MzV2LTYuOTI5Yy0uOTY1LjY0NC0yLjA5IDEuMTk1LTMuMzc1IDEuNjU4LTEuMjg2LjQ2Mi0yLjU2MS42OTMtMy44MjYuNjkzLTEuMzg2IDAtMi40NjUtLjI3MS0zLjIzOC0uODEzLS43NzQtLjU0My0xLjE2LTEuMjg3LTEuMTYtMi4yM20tMzUuMDY1LTcuNTYyYzAtMy4yMzQuNzMyLTUuNzA0IDIuMTk5LTcuNDExIDEuNDY1LTEuNzA3IDMuNTY0LTIuNTYgNi4yOTUtMi41NiAyLjY1MiAwIDQuNjcuODUzIDYuMDU1IDIuNTYgMS4zODcgMS43MDcgMi4wNzkgNC4yMzggMi4wNzkgNy41OTIgMCAzLjMzMy0uNzE4IDUuODQ5LTIuMTU0IDcuNTQ3Qy05NC40NDMtLjMwNi05Ni40NTYuNTQyLTk5LjA0Ni41NDJjLTIuNjcyIDAtNC43NDYtLjg4OS02LjIyMi0yLjY2Ny0xLjQ3Ni0xLjc3Ni0yLjIxMy00LjMxMi0yLjIxMy03LjYwNm0tNy41OTMtLjI0MWMwIDUuMTIyIDEuNDQ2IDkuMTc4IDQuMzM5IDEyLjE3MSAyLjg5MiAyLjk5MiA2LjkwOCA0LjQ4OSAxMi4wNDkgNC40ODkgNC44NDEgMCA4LjYyMi0xLjQ0MSAxMS4zNDMtNC4zMjMgMi43MjEtMi44ODMgNC4wODItNi43NzQgNC4wODItMTEuNjc0IDAtNS4wMjItMS40NDYtOS4wMTgtNC4zMzgtMTEuOTktMi44OTItMi45NzMtNi44MjgtNC40NTgtMTEuODA5LTQuNDU4LTQuODAxIDAtOC42MTIgMS40MS0xMS40MzMgNC4yMzItMi44MjIgMi44MjEtNC4yMzMgNi42NzMtNC4yMzMgMTEuNTUzbS0zLjEzNiAxNi40NDljLjU4MyAwIDEuMTA1LS4wNDEgMS41NjctLjEyMWE2LjU2IDYuNTYgMCAwIDAgMS4xNzUtLjMwMXYtNy4zODFjLS4zODIuMjgyLS45MzkuNTQ3LTEuNjcyLjc5OS0uNzMzLjI1MS0xLjYyMi4zNzYtMi42NjYuMzc2LTEuNzg4IDAtMy4yOTktLjc1My00LjUzNC0yLjI1OS0xLjIzNS0xLjUwNy0xLjg1My0zLjgyNi0xLjg1My02Ljk1OXYtMTUuNjM1aC03LjI5VjUuOTY0aDcuMjl2LTQuODhoLjEyYy42NjMgMS42ODcgMS42NjcgMy4wMDcgMy4wMTMgMy45NjIgMS4zNDYuOTUzIDIuOTYyIDEuNDMxIDQuODUgMS40MzFtLTI3Ljk1Ni0yNi4xNzljMS4wODQgMCAyLjI3OS4yNSAzLjU4NS43NTNhMTUuMDYgMTUuMDYgMCAwIDEgMy42MTUgMS45ODh2LTYuNzc4Yy0xLjE2NS0uNjYzLTIuNDg1LTEuMTY1LTMuOTYyLTEuNTA2LTEuNDc1LS4zNDItMy4wOTgtLjUxMi00Ljg2NS0uNTEyLTQuNTU5IDAtOC4yNjUgMS40NC0xMS4xMTYgNC4zMjItMi44NTIgMi44ODItNC4yNzggNi41NjItNC4yNzggMTEuMDQxIDAgNC45ODEgMS40NTcgOS4wODMgNC4zNjkgMTIuMzA3IDIuOTExIDMuMjIzIDcuMDM5IDQuODM1IDEyLjM4MSA0LjgzNSAxLjM2NiAwIDIuNzQ2LS4xNzYgNC4xNDMtLjUyOCAxLjM5NS0uMzUxIDIuNTA0LS43NTcgMy4zMjgtMS4yMTl2LTYuOTljLTEuMTI1LjgyNC0yLjI3NCAxLjQ2Mi0zLjQ1IDEuOTE0YTkuOTY2IDkuOTY2IDAgMCAxLTMuNTk5LjY3OGMtMi44NzIgMC01LjE5Mi0uOTM1LTYuOTU5LTIuODAyLTEuNzY4LTEuODY4LTIuNjUxLTQuMzg4LTIuNjUxLTcuNTYyIDAtMy4xMzMuODQ4LTUuNTczIDIuNTQ1LTcuMzIxIDEuNjk3LTEuNzQ3IDQuMDAyLTIuNjIgNi45MTQtMi42Mm0tMjIuMTEyLTUuMzAyaC03LjI5VjUuOTY1aDcuMjl6bS04LjA0NCAzOS45MTZjMCAxLjIwNS40MzcgMi4yMTQgMS4zMTEgMy4wMjcuODc0LjgxNCAxLjkxMiAxLjIyMSAzLjExNyAxLjIyMSAxLjI4NiAwIDIuMzUxLS40MTggMy4xOTQtMS4yNS44NDQtLjgzNCAxLjI2NS0xLjgzNCAxLjI2NS0yLjk5OCAwLTEuMTg1LS40MzEtMi4xOC0xLjI5NS0yLjk4Mi0uODY0LS44MDQtMS45MTgtMS4yMDUtMy4xNjQtMS4yMDUtMS4yNDUgMC0yLjI5NC40MDYtMy4xNDcgMS4yMTktLjg1NS44MTQtMS4yODEgMS44MDMtMS4yODEgMi45NjhtLTYuMjczIDMuMjgzdi00My4xOTloLTcuNTAxdjMzLjg2aC0uMTJsLTEzLjQwNy0zMy44NmgtNC45N2wtMTMuNzM4IDMzLjg2aC0uMDl2LTMzLjg2aC02LjkyOXY0My4xOTloMTAuNzU1bDEyLjQxMi0zMi4wMjNoLjE4bDEzLjEwNSAzMi4wMjN6IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzOTQuOTQyIDExMC44NDQpIi8+PC9nPjxwYXRoIHN0eWxlPSJmaWxsOiNmMjUwMjI7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmUiIGQ9Ik0xMDYuMjEzIDEwOS4yMkg3MS45OTV2MzQuMjE4aDM0LjIxOHoiIHRyYW5zZm9ybT0ibWF0cml4KDEuMzMzMzMgMCAwIC0xLjMzMzMzIDAgMjg3LjI0NCkiLz48cGF0aCBzdHlsZT0iZmlsbDojN2ZiYTAwO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lIiBkPSJNMTQzLjk5MyAxMDkuMjJoLTM0LjIxOHYzNC4yMThoMzQuMjE4eiIgdHJhbnNmb3JtPSJtYXRyaXgoMS4zMzMzMyAwIDAgLTEuMzMzMzMgMCAyODcuMjQ0KSIvPjxwYXRoIHN0eWxlPSJmaWxsOiMwMGE0ZWY7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmUiIGQ9Ik0xMDYuMjEzIDcxLjQ0SDcxLjk5NXYzNC4yMThoMzQuMjE4eiIgdHJhbnNmb3JtPSJtYXRyaXgoMS4zMzMzMyAwIDAgLTEuMzMzMzMgMCAyODcuMjQ0KSIvPjxwYXRoIHN0eWxlPSJmaWxsOiNmZmI5MDA7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmUiIGQ9Ik0xNDMuOTkzIDcxLjQ0aC0zNC4yMTh2MzQuMjE4aDM0LjIxOHoiIHRyYW5zZm9ybT0ibWF0cml4KDEuMzMzMzMgMCAwIC0xLjMzMzMzIDAgMjg3LjI0NCkiLz48cGF0aCBzdHlsZT0iZmlsbDojZjI1MDIyO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lIiBkPSJNMTA2LjIxMyAxMDkuMjJINzEuOTk1djM0LjIxOGgzNC4yMTh6IiB0cmFuc2Zvcm09Im1hdHJpeCgxLjMzMzMzIDAgMCAtMS4zMzMzMyAwIDI4Ny4yNDQpIi8+PHBhdGggc3R5bGU9ImZpbGw6IzdmYmEwMDtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZSIgZD0iTTE0My45OTMgMTA5LjIyaC0zNC4yMTh2MzQuMjE4aDM0LjIxOHoiIHRyYW5zZm9ybT0ibWF0cml4KDEuMzMzMzMgMCAwIC0xLjMzMzMzIDAgMjg3LjI0NCkiLz48cGF0aCBzdHlsZT0iZmlsbDojMDBhNGVmO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lIiBkPSJNMTA2LjIxMyA3MS40NEg3MS45OTV2MzQuMjE4aDM0LjIxOHoiIHRyYW5zZm9ybT0ibWF0cml4KDEuMzMzMzMgMCAwIC0xLjMzMzMzIDAgMjg3LjI0NCkiLz48cGF0aCBzdHlsZT0iZmlsbDojZmZiOTAwO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lIiBkPSJNMTQzLjk5MyA3MS40NGgtMzQuMjE4djM0LjIxOGgzNC4yMTh6IiB0cmFuc2Zvcm09Im1hdHJpeCgxLjMzMzMzIDAgMCAtMS4zMzMzMyAwIDI4Ny4yNDQpIi8+PC9zdmc+";

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
    private version: string;

    constructor(options: AzureMapTilesModelOptions) {
        const azureUrl = "https://atlas.microsoft.com/map/tile";
        const apiVersion = options.version ? options.version : "2024-04-01";
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
        this.version = apiVersion;
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
            const apiVersion = this.version;
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
                    return element.textContent;
                })
                if (!this._lastRequestResult.includes(aTags[0])) this._lastRequestResult.push(aTags[0]);
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
