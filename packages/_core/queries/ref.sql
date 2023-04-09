-- Prices by

SELECT
	Date(ListingApartment.createdAt),
	 ListingApartment.`district`,
	AVG(ListingApartment.`statPricePerMeterUsd`) as statPricePerMeterUsd,
	AVG(ListingApartment.`statPricePerMeterAmd`) as statPricePerMeterAmd
FROM
	ListingApartment
WHERE
    ListingApartment.`isNewDevelopment` = true AND
	ListingApartment.`type`= 'SELL'
GROUP BY
	Date(ListingApartment.createdAt), ListingApartment.`district`

-- Prices by month

SELECT
	Date(ListingApartment.createdAt),
	 ListingApartment.`district`,
	AVG(ListingApartment.`statPricePerMeterUsd`) as statPricePerMeterUsd,
	AVG(ListingApartment.`statPricePerMeterAmd`) as statPricePerMeterAmd
FROM
	ListingApartment
WHERE
    ListingApartment.`isNewDevelopment` = true AND
	ListingApartment.`type`= 'RENT'
GROUP BY
	Date(ListingApartment.createdAt), ListingApartment.`district`

-- Prices by week

SELECT
	WEEK(ListingApartment.createdAt) as week,
	 ListingApartment.`district`,
	AVG(ListingApartment.`statPricePerMeterUsd`) as statPricePerMeterUsd,
	AVG(ListingApartment.`statPricePerMeterAmd`) as statPricePerMeterAmd
FROM
	ListingApartment
WHERE
    ListingApartment.`isNewDevelopment` = true AND
	ListingApartment.`type`= 'SELL'
GROUP BY
	WEEK(ListingApartment.createdAt), ListingApartment.`district`
