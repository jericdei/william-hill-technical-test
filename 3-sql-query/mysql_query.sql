SELECT
  "campaigns".*,
  (
    SELECT
      COUNT(*)
    FROM
      "rounds"
    WHERE
      "campaigns"."id" = "rounds"."campaign_id"
  ) AS "rounds_count",
  (
    SELECT
      COUNT(*)
    FROM
      "segments"
      INNER JOIN "rounds" ON "rounds"."id" = "segments"."round_id"
    WHERE
      "campaigns"."id" = "rounds"."campaign_id"
  ) AS "segments_count"
FROM
  "campaigns"
WHERE
  "campaigns"."name" LIKE 'MyTestCampaign%'
AND
  "rounds_count" >= 3
ORDER BY
  "rounds_count" DESC
LIMIT
  10;