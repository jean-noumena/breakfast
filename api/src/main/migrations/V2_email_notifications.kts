import com.noumenadigital.npl.lang.PartyValue
import com.noumenadigital.npl.migration.util.mapPrototypesInMigration
import com.noumenadigital.platform.migration.dsl.IdPair
import com.noumenadigital.platform.migration.dsl.migration
import com.noumenadigital.npl.lang.Claims

val fromVersion = "1.0.0?"
val toVersion = "breakfast-2.0.0?"
val packageName = "breakfast"

val prototypes = mapPrototypesInMigration(
    overrideEnums = listOf(
        // Email connector types
        IdPair("", "/$toVersion/connector/v1/email/EmailStatus"),
        // Blockchain connector enums
        IdPair("", "/$toVersion/connector/v1/blockchain/BlockchainType"),
        IdPair("", "/$toVersion/connector/v1/blockchain/BlockchainStatus"),
        IdPair("", "/$toVersion/connector/v1/blockchain/WalletType"),
        IdPair("", "/$toVersion/connector/v1/blockchain/WalletStorageType"),

        // HTTP connector types
        IdPair("", "/$toVersion/connector/v1/http/HttpMethod"),
        IdPair("", "/$toVersion/connector/v1/http/ExecutionStatus"),
        IdPair("", "/$toVersion/connector/v1/http/HttpData"),
    ),
    overrideStructs = listOf(
        // Blockchain wallet types
        IdPair("", "/$toVersion/connector/v1/blockchain/Asset"),
        IdPair("", "/$toVersion/connector/v1/blockchain/WalletCreate"),
        IdPair("", "/$toVersion/connector/v1/blockchain/WalletCreateResponse"),
        IdPair("", "/$toVersion/connector/v1/blockchain/WalletFaucetFund"),
        IdPair("", "/$toVersion/connector/v1/blockchain/WalletFaucetFundResponse"),

        // Blockchain connector structs (integer types)
        IdPair("", "/$toVersion/connector/v1/blockchain/Int8"),
        IdPair("", "/$toVersion/connector/v1/blockchain/Int16"),
        IdPair("", "/$toVersion/connector/v1/blockchain/Int32"),
        IdPair("", "/$toVersion/connector/v1/blockchain/Int64"),
        IdPair("", "/$toVersion/connector/v1/blockchain/Int128"),
        IdPair("", "/$toVersion/connector/v1/blockchain/Int256"),

        // Blockchain connector structs (unsigned integer types)
        IdPair("", "/$toVersion/connector/v1/blockchain/Uint8"),
        IdPair("", "/$toVersion/connector/v1/blockchain/Uint16"),
        IdPair("", "/$toVersion/connector/v1/blockchain/Uint32"),
        IdPair("", "/$toVersion/connector/v1/blockchain/Uint64"),
        IdPair("", "/$toVersion/connector/v1/blockchain/Uint128"),
        IdPair("", "/$toVersion/connector/v1/blockchain/Uint256"),

        // Blockchain connector structs (other types)
        IdPair("", "/$toVersion/connector/v1/blockchain/Address"),
        IdPair("", "/$toVersion/connector/v1/blockchain/TokenBalance"),
        IdPair("", "/$toVersion/connector/v1/blockchain/TokenDecimal"),
        IdPair("", "/$toVersion/connector/v1/blockchain/ContractReference"),
        IdPair("", "/$toVersion/connector/v1/blockchain/Bytes32"),
        IdPair("", "/$toVersion/connector/v1/blockchain/StructureField"),
        IdPair("", "/$toVersion/connector/v1/blockchain/Structure"),
        IdPair("", "/$toVersion/connector/v1/blockchain/EnumUnitVariant"),
        IdPair("", "/$toVersion/connector/v1/blockchain/EnumDataVariant"),
        IdPair("", "/$toVersion/connector/v1/blockchain/ArgData"),
        IdPair("", "/$toVersion/connector/v1/blockchain/BlockchainFunction"),
        IdPair("", "/$toVersion/connector/v1/blockchain/BlockchainFunctionResponse"),
        IdPair("", "/$toVersion/connector/v1/blockchain/BlockchainDeploy"),
        IdPair("", "/$toVersion/connector/v1/blockchain/BlockchainDeployResponse"),

        // Email connector structs
        IdPair("", "/$toVersion/connector/v1/email/SendEmailResponse"),

        // HTTP connector structs
        IdPair("", "/$toVersion/connector/v1/http/HttpRequest"),
        IdPair("", "/$toVersion/connector/v1/http/HttpResponse")
    )
)

val adminPartyValue = PartyValue(
    Claims(
        mapOf(
            "role" to setOf("admin")
        )
    )
)

val emailServicePartyValue = PartyValue(
    Claims(
        mapOf(
            "party" to setOf("email_connector")
        )
    )
)

migration("${prototypes.current} to ${prototypes.target}")
    .transformProtocol(
        "/$fromVersion/$packageName/BreakfastEvent",
        "/$toVersion/$packageName/BreakfastEvent"
    ) {
        val newParties = if (parties.contains(adminPartyValue)) {
            parties
        } else {
            parties.plus(adminPartyValue).plus(emailServicePartyValue)
        }
        parties(*newParties.toTypedArray())
    }
    .transformProtocol(
        "/$fromVersion/$packageName/Participant",
        "/$toVersion/$packageName/Participant"
    ) {
        val newParties = if (parties.contains(adminPartyValue)) {
            parties
        } else {
            parties.plus(adminPartyValue).plus(emailServicePartyValue)
        }
        parties(*newParties.toTypedArray())
    }
    .retag(prototypes)
