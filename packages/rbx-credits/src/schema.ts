// Example: https://economy.roblox.com/v2/developer-products/6372755229/info
// {
//     "TargetId": 6372755229,
//     "ProductType": "User Product",
//     "AssetId": 6372755229,
//     "ProductId": 1252895230,
//     "Name": "Grid",
//     "Description": "Grid texture for use in the baseplate.\nGet a copy here: https://www.roblox.com/library/6372755236/Grid",
//     "AssetTypeId": 1,
//     "Creator": {
//         "Id": 782148096,
//         "Name": "meow_pizza",
//         "CreatorType": "User",
//         "CreatorTargetId": 782148096
//     },
//     "IconImageAssetId": 0,
//     "Created": "2021-02-10T06:55:47.43Z",
//     "Updated": "2022-03-29T06:15:32.71Z",
//     "PriceInRobux": null,
//     "PriceInTickets": null,
//     "Sales": 0,
//     "IsNew": false,
//     "IsForSale": false,
//     "IsPublicDomain": false,
//     "IsLimited": false,
//     "IsLimitedUnique": false,
//     "Remaining": null,
//     "MinimumMembershipLevel": 0
// }

import { z } from 'zod';

export const DeveloperProductInfo = z.object({
	Created: z.string(),
	Creator: z.object({
		Id: z.number(),
		Name: z.string(),
	}),
	Description: z.string().nullable(),
	Name: z.string(),
	TargetId: z.number(),
	Updated: z.string().nullable(),
});
export type DeveloperProductInfo = z.infer<typeof DeveloperProductInfo>;
