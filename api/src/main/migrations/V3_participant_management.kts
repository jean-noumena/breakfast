import com.noumenadigital.npl.lang.PartyValue
import com.noumenadigital.npl.migration.util.mapPrototypesInMigration
import com.noumenadigital.platform.migration.dsl.IdPair
import com.noumenadigital.platform.migration.dsl.migration
import com.noumenadigital.npl.lang.Claims
import com.noumenadigital.platform.migration.dsl.StatesEnumTypeId

val fromVersion = "breakfast-2.0.0?"
val toVersion = "breakfast-3.0.0?"
val packageName = "breakfast"

val prototypes = mapPrototypesInMigration()

migration("${prototypes.current} to ${prototypes.target}")
    /*.transformEnum(
        StatesEnumTypeId("/$fromVersion/$packageName/Participant"),
        StatesEnumTypeId("/$toVersion/$packageName/Participant"),
        mapOf(
            "" to "active",
        )
    )*/
    .retag(prototypes)
